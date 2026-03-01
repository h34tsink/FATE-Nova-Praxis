param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$InputArgs
)

$ErrorActionPreference = 'Stop'

$vaultRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$entityCardsDir = Join-Path $vaultRoot 'GM AI\Entity Cards'
$statePath = Join-Path $vaultRoot '_Assets\Scripts\np-gm-state.json'

$npcMap = @{
    'kestrel'           = 'R4\Kestrel (R4 Important NPC).md'
    'nowak'             = 'R4\Isabella Nowak (R4 Important NPC).md'
    'isabella'          = 'R4\Isabella Nowak (R4 Important NPC).md'
    'chimera'           = 'R5\Chimera (R5 Villain).md'
    'valare-fork'       = 'R4\Valare Fork (R4 Important NPC).md'
    'valare-integrated' = 'R4\Valare Integrated (R4 Personal Agent Ally).md'
    'seren'             = 'R3\Seren (R3 Important Contact).md'
    'kal'               = 'R2\Kal Paddock (R2 Minor Contact).md'
    'paddock'           = 'R2\Kal Paddock (R2 Minor Contact).md'
    'lighthouse'        = 'R3\Lighthouse Tactical Controller (R3 Systems Agent).md'
}

function Show-Help {
    @"
np-gm-router usage (from vault root):
    pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm [-profile core|full|rules|history|lore|location|gear] [-style table-short|gm-deep] [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc <name> [-mode prompt|summary|details|attitude|mission] [-style table-short|gm-deep] [-context "a" "b" "c"] [-goal "..."] [-secret "..."] [-copy]
    pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -game "<question>" [-domain core|full|rules|history|lore|location|gear] [-style table-short|gm-deep] [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -npc <name> "<question>" [-style table-short|gm-deep] [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -npc <name> -player "<player>" "<question>" [-style table-short|gm-deep] [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /state-show
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /state-set [-active-npc <name>] [-objective "..."] [-scene "a" "b" "c"] [-clear-scene]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /state-clear
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc-list
"@
}

function New-SessionState {
    [pscustomobject]@{
        activeNpc = ''
        objective = ''
        scene     = @()
        updatedAt = (Get-Date).ToString('s')
    }
}

function Load-SessionState {
    if (-not (Test-Path $statePath)) {
        return New-SessionState
    }

    try {
        $raw = Get-Content $statePath -Raw
        $state = $raw | ConvertFrom-Json
        if (-not $state.scene) {
            $state | Add-Member -MemberType NoteProperty -Name scene -Value @() -Force
        }
        return $state
    }
    catch {
        return New-SessionState
    }
}

function Save-SessionState {
    param([pscustomobject]$State)

    $State.updatedAt = (Get-Date).ToString('s')
    $dir = Split-Path $statePath -Parent
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $State | ConvertTo-Json -Depth 6 | Set-Content -Path $statePath -Encoding UTF8
}

function Get-SessionStateText {
    param([pscustomobject]$State)

    $sceneLines = @($State.scene | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
    $sceneBlock = if ($sceneLines.Count -gt 0) {
        ($sceneLines | ForEach-Object { "- $_" }) -join [Environment]::NewLine
    }
    else {
        '- [none]'
    }

    @"
Session state:
- Active NPC: $(if ([string]::IsNullOrWhiteSpace($State.activeNpc)) { '[none]' } else { $State.activeNpc })
- Objective: $(if ([string]::IsNullOrWhiteSpace($State.objective)) { '[none]' } else { $State.objective })
- Updated: $(if ([string]::IsNullOrWhiteSpace($State.updatedAt)) { '[unknown]' } else { $State.updatedAt })
Scene bullets:
$sceneBlock
"@
}

function Read-CardText {
    param([string]$NpcKey)
    if (-not $npcMap.ContainsKey($NpcKey)) {
        $valid = ($npcMap.Keys | Sort-Object -Unique) -join ', '
        throw "Unknown NPC '$NpcKey'. Valid: $valid"
    }

    $fileName = $npcMap[$NpcKey]
    $path = Join-Path $entityCardsDir $fileName
    if (-not (Test-Path $path)) {
        throw "NPC card missing: $path"
    }

    return Get-Content $path -Raw
}

function Get-CardValue {
    param(
        [string]$CardText,
        [string]$Pattern,
        [string]$Fallback = ''
    )

    $m = [regex]::Match($CardText, $Pattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
    if ($m.Success) { return $m.Groups[1].Value.Trim() }
    return $Fallback
}

function Build-NpcObject {
    param([string]$NpcKey)

    $card = Read-CardText -NpcKey $NpcKey

    [pscustomobject]@{
        Key            = $NpcKey
        Name           = Get-CardValue -CardText $card -Pattern '-\s*Name:\s*(.+)$' -Fallback $NpcKey
        Class          = Get-CardValue -CardText $card -Pattern '-\s*Class:\s*(.+)$' -Fallback 'Important NPC'
        Rank           = Get-CardValue -CardText $card -Pattern '-\s*Complexity Rank:\s*(.+)$' -Fallback 'R3'
        Tone           = Get-CardValue -CardText $card -Pattern '-\s*Baseline tone:\s*(.+)$'
        Cadence        = Get-CardValue -CardText $card -Pattern '-\s*Cadence:\s*(.+)$'
        PrimaryGoal    = Get-CardValue -CardText $card -Pattern '-\s*Primary goal:\s*(.+)$'
        SecondaryGoal  = Get-CardValue -CardText $card -Pattern '-\s*Secondary goal:\s*(.+)$'
        Fear           = Get-CardValue -CardText $card -Pattern '-\s*Fear\s*/\s*pressure point:\s*(.+)$'
        RedLine        = Get-CardValue -CardText $card -Pattern '-\s*Red line:\s*(.+)$'
        MustHide       = Get-CardValue -CardText $card -Pattern '-\s*Must hide:\s*(.+)$'
        EntryLine      = (Get-CardValue -CardText $card -Pattern '-\s*Entry line:\s*"?(.+?)"?$').Trim('"')
        EscalationLine = (Get-CardValue -CardText $card -Pattern '-\s*Escalation line:\s*"?(.+?)"?$').Trim('"')
        ExitLine       = (Get-CardValue -CardText $card -Pattern '-\s*Exit line:\s*"?(.+?)"?$').Trim('"')
    }
}

function Build-GmContext {
    param(
        [string]$Profile = 'full',
        [pscustomobject]$State
    )

    $profileValue = if ([string]::IsNullOrWhiteSpace($Profile)) { 'full' } else { $Profile.Trim().ToLowerInvariant() }

    $profileFiles = switch ($profileValue) {
        'full' {
            @(
                'GM AI/Claude Code - GM Runtime System.md',
                'GM AI/Claude Code - Prompt Pack.md',
                'GM AI/Claude Code - Persona & Complexity Matrix.md',
                'GM AI/NPC Command Board.md',
                'Campaign Overview/Timeline of Events.md',
                'Campaign Overview/What has Come Before.md',
                'Campaign Overview/Cold Start Syndicate - Campaign Summary.md',
                'Sessions/Index.md',
                'Plot/Index.md',
                'Factions/Index.md',
                'Locations/Index.md',
                'Rules and Mechanics/Index.md',
                'Rules and Mechanics/Pneuma Rules/Index.md',
                'Data/gear.ts',
                'Data/nova-praxis-skills.ts',
                'Data/nova-praxis-states.ts',
                'Data/nova-praxis-houses.ts',
                'Data/nova-praxis-sleeves.ts',
                'Data/augmentations.ts',
                'pdf_full_extract.txt',
                'machinations_full_extract.txt',
                'Nova Praxis Rulebook (Cleaned).txt'
            )
        }
        'rules' {
            @(
                'Rules and Mechanics/Index.md',
                'Rules and Mechanics/Pneuma Rules/Index.md',
                'Rules and Mechanics/Pneuma Rules/Pneuma_Architects_Echo_Rules.md',
                'Rules and Mechanics/Savant Programs Guide.md',
                'Rules and Mechanics/Skills.md'
            )
        }
        'history' {
            @(
                'Campaign Overview/Timeline of Events.md',
                'Campaign Overview/What has Come Before.md',
                'Campaign Overview/Cold Start Syndicate - Campaign Summary.md',
                'Sessions/Index.md'
            )
        }
        'lore' {
            @(
                'Factions/Index.md',
                'Glossary/Index.md',
                'Cosmology/bardic_cosmology_for_game_universe_v1.md',
                'pdf_full_extract.txt',
                'machinations_full_extract.txt'
            )
        }
        'location' {
            @(
                'Locations/Index.md',
                'Locations/Sol System/Index.md',
                'Locations/Exoplanets/Index.md'
            )
        }
        'gear' {
            @(
                'Data/gear.ts',
                'Data/augmentations.ts',
                'Data/nova-praxis-sleeves.ts',
                'Rules and Mechanics/Equipment.md',
                'Rules and Mechanics/Augmentations.md'
            )
        }
        default {
            @(
                'GM AI/Claude Code - GM Runtime System.md',
                'GM AI/Claude Code - Prompt Pack.md',
                'GM AI/Claude Code - Persona & Complexity Matrix.md',
                'GM AI/NPC Command Board.md',
                'pdf_full_extract.txt',
                'machinations_full_extract.txt',
                'Nova Praxis Rulebook (Cleaned).txt'
            )
        }
    }

    $fileBlock = ($profileFiles | ForEach-Object { "- $_" }) -join [Environment]::NewLine
    $stateBlock = if ($State) { Get-SessionStateText -State $State } else { 'Session state: [not loaded]' }

    @"
You are running as Nova Praxis GM copilot.

Hard rules:
- Use vault canon first, then pdf_full_extract.txt and machinations_full_extract.txt.
- Keep outputs concise unless asked for expansion.
- Distinguish what is true vs what an NPC believes.
- Maintain tone: transhuman, corporate/memetic pressure, identity continuity.

Active context profile: $profileValue

Primary context files:
$fileBlock

$stateBlock
"@
}

function Build-NpcPrompt {
    param(
        [pscustomobject]$Npc,
        [string[]]$Context,
        [string]$GoalOverride,
        [string]$SecretOverride,
        [string]$Style = 'table-short'
    )

    $ctx = ($Context | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 3)
    if ($ctx.Count -eq 0) {
        $ctx = @('[scene context missing - add -context or set /state-set -scene]')
    }

    $goal = if (-not [string]::IsNullOrWhiteSpace($GoalOverride)) { $GoalOverride } elseif ($Npc.PrimaryGoal) { $Npc.PrimaryGoal } else { '[goal]' }
    $secret = if (-not [string]::IsNullOrWhiteSpace($SecretOverride)) { $SecretOverride } elseif ($Npc.MustHide) { $Npc.MustHide } else { '[secret]' }

    $ctxBlock = ($ctx | ForEach-Object { "- $_" }) -join [Environment]::NewLine
    $styleValue = if ([string]::IsNullOrWhiteSpace($Style)) { 'table-short' } else { $Style.Trim().ToLowerInvariant() }
    $lengthRule = if ($styleValue -eq 'gm-deep') { 'Keep response concise (2-6 lines).' } else { 'Keep response concise (1-2 lines).' }
    $intentRule = if ($styleValue -eq 'gm-deep') { 'Include Intent and one GM Note line after dialogue.' } else { 'Include one Intent line after dialogue.' }

    @"
You are speaking as: **$($Npc.Name)**.
Entity class: **$($Npc.Class)**.
Complexity rank: **$($Npc.Rank)**.
Current context:
$ctxBlock
What this entity wants right now: **$goal**.
What they must avoid revealing: **$secret**.

Constraints:
- Stay in-canon using vault notes and extracted PDFs.
- $lengthRule
- Match speech style for class + rank.
- $intentRule

Return:
1) In-character response
2) Intent: ...
3) GM Note: ... (only if style is gm-deep)
"@
}

function Build-NpcSummary {
    param([pscustomobject]$Npc)

    @"
NPC: $($Npc.Name) ($($Npc.Rank), $($Npc.Class))
Primary goal: $($Npc.PrimaryGoal)
Secondary goal: $($Npc.SecondaryGoal)
Pressure point: $($Npc.Fear)
Red line: $($Npc.RedLine)
Must hide: $($Npc.MustHide)
"@
}

function Build-NpcAttitude {
    param([pscustomobject]$Npc)

    @"
NPC attitude profile: $($Npc.Name)
- Baseline tone: $($Npc.Tone)
- Cadence: $($Npc.Cadence)
- Entry line: $($Npc.EntryLine)
- Escalation line: $($Npc.EscalationLine)
- Exit line: $($Npc.ExitLine)
"@
}

function Build-GmAskGame {
    param(
        [string]$Question,
        [string]$Domain = 'core',
        [string]$Style = 'table-short',
        [pscustomobject]$State
    )

    $domainValue = if ([string]::IsNullOrWhiteSpace($Domain)) { 'core' } else { $Domain.Trim().ToLowerInvariant() }

    $domainHint = switch ($domainValue) {
        'full' { 'Use full campaign context: rules + history + lore + locations + gear + session continuity.' }
        'rules' { 'Prioritize rules adjudication and mechanical consistency first.' }
        'history' { 'Prioritize timeline continuity, prior events, and established campaign consequences.' }
        'lore' { 'Prioritize faction/cosmology/world canon and narrative plausibility.' }
        'location' { 'Prioritize spatial/location continuity, local constraints, and travel plausibility.' }
        'gear' { 'Prioritize equipment/augmentation/sleeve constraints and loadout realism.' }
        default { 'Use core GM runtime and immediate scene context first.' }
    }

    $isRulesMode = $domainValue -eq 'rules' -or $domainValue -eq 'full' -or ($Question -match '(?i)\b(refresh|fate point|fate points|stunt|stunts|stress|consequence|consequences|action|simple action|free action|compel|invoke|difficulty|roll|skill rank)\b')

    $styleValue = if ([string]::IsNullOrWhiteSpace($Style)) { 'table-short' } else { $Style.Trim().ToLowerInvariant() }
    $lengthHint = if ($styleValue -eq 'gm-deep') { 'Provide structured answer up to 16 lines with brief headings.' } else { 'Keep under 8 lines unless asked for detail.' }
    $stateHint = if ($State) { Get-SessionStateText -State $State } else { 'Session state: [not loaded]' }
    $rulesFormat = if ($isRulesMode) {
        @"
Rules adjudication output format (required):
1) Answer: one clear ruling sentence.
2) Exceptions/Modifiers: 1-4 bullets.
3) Source files checked: 2-5 concrete files.
4) Confidence: high|medium|low with a one-line reason.

Rules source priority:
- Nova Praxis Rulebook (Cleaned).txt
- pdf_full_extract.txt
- Rules and Mechanics/*.md
- Data/*.ts
- Glossary/templates/reference notes

If sources conflict, prefer higher-priority source and explicitly state conflict + chosen ruling.
"@
    }
    else {
        'For non-rules questions, keep narrative utility and continuity as priority.'
    }

    @"
GM question:
$Question

$domainHint

$stateHint

Answer as rules-and-lore arbiter for Nova Praxis FATE.
Use vault canon first, then pdf_full_extract.txt and machinations_full_extract.txt.
If conflict exists: show conflict summary, chosen interpretation, and confidence (low/med/high).
$rulesFormat
$lengthHint
"@
}

function Build-GmAskNpc {
    param(
        [pscustomobject]$Npc,
        [string]$Question,
        [string]$PlayerName,
        [string]$Style = 'table-short'
    )

    $styleValue = if ([string]::IsNullOrWhiteSpace($Style)) { 'table-short' } else { $Style.Trim().ToLowerInvariant() }
    $publicLineHint = if ($styleValue -eq 'gm-deep') { '2-4 lines' } else { '1-2 lines' }
    $hiddenHint = if ($styleValue -eq 'gm-deep') { 'Hidden truth (GM-only): include one short paragraph.' } else { 'Hidden truth (GM-only): one line.' }

    if ([string]::IsNullOrWhiteSpace($PlayerName)) {
        @"
You are $($Npc.Name). The GM is asking you backstage (not in front of players).
Question: $Question

Answer in-character but with GM-facing clarity:
- What you would say publicly
- What you are concealing
- Intent (one line)
- Public answer length: $publicLineHint
"@
    }
    else {
        @"
You are $($Npc.Name). Player '$PlayerName' asks in-scene:
$Question

Respond exactly as the NPC would in-game ($publicLineHint), then include:
Intent: ...
$hiddenHint
"@
    }
}

function Emit-Output {
    param(
        [string]$Text,
        [bool]$Copy,
        [bool]$AsJson,
        [string]$Type,
        [string]$Command
    )

    if ($Copy) {
        Set-Clipboard -Value $Text
    }

    if ($AsJson) {
        [pscustomobject]@{
            command = $Command
            type    = $Type
            content = $Text
            copied  = $Copy
        } | ConvertTo-Json -Depth 5
    }
    else {
        $Text
    }
}

if (-not $InputArgs -or $InputArgs.Count -eq 0) {
    Show-Help
    exit 0
}

$cmd = $InputArgs[0].Trim().ToLowerInvariant()
$rest = @()
if ($InputArgs.Count -gt 1) {
    $rest = $InputArgs[1..($InputArgs.Count - 1)]
}

$copy = $false
$json = $false
$mode = 'prompt'
$profile = 'full'
$domain = 'core'
$style = 'table-short'
$npcName = $null
$playerName = $null
$goal = $null
$secret = $null
$objective = $null
$sceneOverride = $null
$clearScene = $false
$context = @()
$question = $null
$state = Load-SessionState

for ($i = 0; $i -lt $rest.Count; $i++) {
    $token = $rest[$i]
    switch -Regex ($token.ToLowerInvariant()) {
        '^-copy$' { $copy = $true; continue }
        '^-json$' { $json = $true; continue }
        '^-mode$' {
            if ($i + 1 -lt $rest.Count) { $i++; $mode = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -mode'
        }
        '^-profile$' {
            if ($i + 1 -lt $rest.Count) { $i++; $profile = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -profile'
        }
        '^-domain$' {
            if ($i + 1 -lt $rest.Count) { $i++; $domain = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -domain'
        }
        '^-style$' {
            if ($i + 1 -lt $rest.Count) { $i++; $style = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -style'
        }
        '^-npc$' {
            if ($i + 1 -lt $rest.Count) { $i++; $npcName = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -npc'
        }
        '^-active-npc$' {
            if ($i + 1 -lt $rest.Count) { $i++; $npcName = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -active-npc'
        }
        '^-player$' {
            if ($i + 1 -lt $rest.Count) { $i++; $playerName = $rest[$i]; continue }
            throw 'Missing value for -player'
        }
        '^-goal$' {
            if ($i + 1 -lt $rest.Count) { $i++; $goal = $rest[$i]; continue }
            throw 'Missing value for -goal'
        }
        '^-secret$' {
            if ($i + 1 -lt $rest.Count) { $i++; $secret = $rest[$i]; continue }
            throw 'Missing value for -secret'
        }
        '^-context$' {
            while ($i + 1 -lt $rest.Count -and -not $rest[$i + 1].StartsWith('-')) {
                $i++
                $context += $rest[$i]
            }
            continue
        }
        '^-scene$' {
            $sceneOverride = @()
            while ($i + 1 -lt $rest.Count -and -not $rest[$i + 1].StartsWith('-')) {
                $i++
                $sceneOverride += $rest[$i]
            }
            continue
        }
        '^-clear-scene$' {
            $clearScene = $true
            continue
        }
        '^-objective$' {
            if ($i + 1 -lt $rest.Count) { $i++; $objective = $rest[$i]; continue }
            throw 'Missing value for -objective'
        }
        '^-game$' {
            if ($i + 1 -lt $rest.Count) { $i++; $question = $rest[$i]; continue }
            throw 'Missing value for -game'
        }
        default {
            if (-not $npcName -and $cmd -eq '/npc' -and -not $token.StartsWith('-')) {
                $npcName = $token.ToLowerInvariant()
            }
            elseif (-not $question -and $cmd -eq '/gm-ask' -and -not $token.StartsWith('-')) {
                $question = $token
            }
        }
    }
}

switch ($cmd) {
    '/help' {
        Show-Help
        break
    }
    '/npc-list' {
        $text = ($npcMap.Keys | Sort-Object -Unique) -join [Environment]::NewLine
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'npc-list' -Command $cmd
        break
    }
    '/gm' {
        $text = Build-GmContext -Profile $profile -State $state
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'gm-context' -Command $cmd
        break
    }
    '/state-show' {
        $text = Get-SessionStateText -State $state
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'state-show' -Command $cmd
        break
    }
    '/state-clear' {
        $state = New-SessionState
        Save-SessionState -State $state
        $text = 'Session state reset.'
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'state-clear' -Command $cmd
        break
    }
    '/state-set' {
        if (-not [string]::IsNullOrWhiteSpace($npcName)) {
            if (-not $npcMap.ContainsKey($npcName)) {
                throw "Unknown NPC '$npcName'. Use /npc-list."
            }
            $state.activeNpc = $npcName
        }

        if (-not [string]::IsNullOrWhiteSpace($objective)) {
            $state.objective = $objective
        }

        if ($clearScene) {
            $state.scene = @()
        }

        if ($sceneOverride -and $sceneOverride.Count -gt 0) {
            $state.scene = @($sceneOverride | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 6)
        }

        Save-SessionState -State $state
        $text = Get-SessionStateText -State $state
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'state-set' -Command $cmd
        break
    }
    '/npc' {
        if ([string]::IsNullOrWhiteSpace($npcName) -and -not [string]::IsNullOrWhiteSpace($state.activeNpc)) {
            $npcName = $state.activeNpc
        }

        if ([string]::IsNullOrWhiteSpace($npcName)) {
            throw 'Usage: /npc <name> [-mode prompt|summary|details|attitude|mission] [-context ...] OR set /state-set -active-npc <name>'
        }
        $npc = Build-NpcObject -NpcKey $npcName
        $state.activeNpc = $npcName

        if (($mode -eq 'prompt') -and ($context.Count -eq 0) -and $state.scene) {
            $context = @($state.scene)
        }

        if ([string]::IsNullOrWhiteSpace($goal) -and -not [string]::IsNullOrWhiteSpace($state.objective)) {
            $goal = $state.objective
        }

        switch ($mode) {
            'summary' { $text = Build-NpcSummary -Npc $npc }
            'details' { $text = ($npc | ConvertTo-Json -Depth 5) }
            'attitude' { $text = Build-NpcAttitude -Npc $npc }
            'mission' {
                $text = @"
Mission profile: $($npc.Name)
- Primary goal: $($npc.PrimaryGoal)
- Secondary goal: $($npc.SecondaryGoal)
- Pressure point: $($npc.Fear)
- Red line: $($npc.RedLine)
"@
            }
            default { $text = Build-NpcPrompt -Npc $npc -Context $context -GoalOverride $goal -SecretOverride $secret -Style $style }
        }

        Save-SessionState -State $state

        Emit-Output -Text $text -Copy $copy -AsJson $json -Type "npc-$mode" -Command $cmd
        break
    }
    '/gm-ask' {
        if ($question -and -not $npcName) {
            $text = Build-GmAskGame -Question $question -Domain $domain -Style $style -State $state
            Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'gm-ask-game' -Command $cmd
            break
        }

        if (-not $npcName -and -not [string]::IsNullOrWhiteSpace($state.activeNpc)) {
            $npcName = $state.activeNpc
        }

        if (-not $npcName) {
            throw 'Usage: /gm-ask -game "question" OR /gm-ask -npc <name> [-player <name>] "question"'
        }

        if (-not $question) {
            throw 'Missing question for /gm-ask -npc'
        }

        $npc = Build-NpcObject -NpcKey $npcName
        $state.activeNpc = $npcName
        Save-SessionState -State $state
        $text = Build-GmAskNpc -Npc $npc -Question $question -PlayerName $playerName -Style $style
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'gm-ask-npc' -Command $cmd
        break
    }
    default {
        throw "Unknown command '$cmd'. Use /help, /gm, /npc, /gm-ask, /npc-list, /state-show, /state-set, /state-clear"
    }
}
