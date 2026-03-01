param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$InputArgs
)

$ErrorActionPreference = 'Stop'

$vaultRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$entityCardsDir = Join-Path $vaultRoot 'GM AI\Entity Cards'

$npcMap = @{
    'kestrel'           = 'Kestrel (R4 Important NPC).md'
    'nowak'             = 'Isabella Nowak (R4 Important NPC).md'
    'isabella'          = 'Isabella Nowak (R4 Important NPC).md'
    'chimera'           = 'Chimera (R5 Villain).md'
    'valare-fork'       = 'Valare Fork (R4 Important NPC).md'
    'valare-integrated' = 'Valare Integrated (R4 Personal Agent Ally).md'
    'seren'             = 'Seren (R3 Important Contact).md'
    'kal'               = 'Kal Paddock (R2 Minor Contact).md'
    'paddock'           = 'Kal Paddock (R2 Minor Contact).md'
    'lighthouse'        = 'Lighthouse Tactical Controller (R3 Systems Agent).md'
}

function Show-Help {
    @"
np-gm-router usage (from vault root):
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc <name> [-mode prompt|summary|details|attitude|mission] [-context "a" "b" "c"] [-goal "..."] [-secret "..."] [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -game "<question>" [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -npc <name> "<question>" [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /gm-ask -npc <name> -player "<player>" "<question>" [-copy]
  pwsh -File .\_Assets\Scripts\np-gm-router.ps1 /npc-list
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
        Key = $NpcKey
        Name = Get-CardValue -CardText $card -Pattern '-\s*Name:\s*(.+)$' -Fallback $NpcKey
        Class = Get-CardValue -CardText $card -Pattern '-\s*Class:\s*(.+)$' -Fallback 'Important NPC'
        Rank = Get-CardValue -CardText $card -Pattern '-\s*Complexity Rank:\s*(.+)$' -Fallback 'R3'
        Tone = Get-CardValue -CardText $card -Pattern '-\s*Baseline tone:\s*(.+)$'
        Cadence = Get-CardValue -CardText $card -Pattern '-\s*Cadence:\s*(.+)$'
        PrimaryGoal = Get-CardValue -CardText $card -Pattern '-\s*Primary goal:\s*(.+)$'
        SecondaryGoal = Get-CardValue -CardText $card -Pattern '-\s*Secondary goal:\s*(.+)$'
        Fear = Get-CardValue -CardText $card -Pattern '-\s*Fear\s*/\s*pressure point:\s*(.+)$'
        RedLine = Get-CardValue -CardText $card -Pattern '-\s*Red line:\s*(.+)$'
        MustHide = Get-CardValue -CardText $card -Pattern '-\s*Must hide:\s*(.+)$'
        EntryLine = Get-CardValue -CardText $card -Pattern '-\s*Entry line:\s*"(.+)"$'
        EscalationLine = Get-CardValue -CardText $card -Pattern '-\s*Escalation line:\s*"(.+)"$'
        ExitLine = Get-CardValue -CardText $card -Pattern '-\s*Exit line:\s*"(.+)"$'
    }
}

function Build-GmContext {
    @"
You are running as Nova Praxis GM copilot.

Hard rules:
- Use vault canon first, then pdf_full_extract.txt and machinations_full_extract.txt.
- Keep outputs concise unless asked for expansion.
- Distinguish what is true vs what an NPC believes.
- Maintain tone: transhuman, corporate/memetic pressure, identity continuity.

Primary runtime files:
- GM AI/Claude Code - GM Runtime System.md
- GM AI/Claude Code - Prompt Pack.md
- GM AI/Claude Code - Persona & Complexity Matrix.md
- GM AI/NPC Command Board.md
"@
}

function Build-NpcPrompt {
    param(
        [pscustomobject]$Npc,
        [string[]]$Context,
        [string]$GoalOverride,
        [string]$SecretOverride
    )

    if (-not $Context -or $Context.Count -eq 0) {
        throw 'Missing context. Use -context "bullet1" "bullet2" ...'
    }

    $ctx = ($Context | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 3)
    if ($ctx.Count -eq 0) { throw 'No non-empty context lines provided.' }

    $goal = if (-not [string]::IsNullOrWhiteSpace($GoalOverride)) { $GoalOverride } elseif ($Npc.PrimaryGoal) { $Npc.PrimaryGoal } else { '[goal]' }
    $secret = if (-not [string]::IsNullOrWhiteSpace($SecretOverride)) { $SecretOverride } elseif ($Npc.MustHide) { $Npc.MustHide } else { '[secret]' }

    $ctxBlock = ($ctx | ForEach-Object { "- $_" }) -join [Environment]::NewLine

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
- Keep response concise (1-4 lines).
- Match speech style for class + rank.
- Include one Intent line after dialogue.

Return:
1) In-character response
2) Intent: ...
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
- Entry line: "$($Npc.EntryLine)"
- Escalation line: "$($Npc.EscalationLine)"
- Exit line: "$($Npc.ExitLine)"
"@
}

function Build-GmAskGame {
    param([string]$Question)

    @"
GM question:
$Question

Answer as rules-and-lore arbiter for Nova Praxis FATE.
Use vault canon first, then pdf_full_extract.txt and machinations_full_extract.txt.
If conflict exists: show conflict summary, chosen interpretation, and confidence (low/med/high).
Keep under 8 lines unless asked for detail.
"@
}

function Build-GmAskNpc {
    param(
        [pscustomobject]$Npc,
        [string]$Question,
        [string]$PlayerName
    )

    if ([string]::IsNullOrWhiteSpace($PlayerName)) {
@"
You are $($Npc.Name). The GM is asking you backstage (not in front of players).
Question: $Question

Answer in-character but with GM-facing clarity:
- What you would say publicly
- What you are concealing
- Intent (one line)
"@
    }
    else {
@"
You are $($Npc.Name). Player '$PlayerName' asks in-scene:
$Question

Respond exactly as the NPC would in-game (1-4 lines), then include:
Intent: ...
Hidden truth (GM-only): ...
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
            type = $Type
            content = $Text
            copied = $Copy
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
$npcName = $null
$playerName = $null
$goal = $null
$secret = $null
$context = @()
$question = $null

for ($i = 0; $i -lt $rest.Count; $i++) {
    $token = $rest[$i]
    switch -Regex ($token.ToLowerInvariant()) {
        '^-copy$' { $copy = $true; continue }
        '^-json$' { $json = $true; continue }
        '^-mode$' {
            if ($i + 1 -lt $rest.Count) { $i++; $mode = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -mode'
        }
        '^-npc$' {
            if ($i + 1 -lt $rest.Count) { $i++; $npcName = $rest[$i].ToLowerInvariant(); continue }
            throw 'Missing value for -npc'
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
        $text = Build-GmContext
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'gm-context' -Command $cmd
        break
    }
    '/npc' {
        if ([string]::IsNullOrWhiteSpace($npcName)) {
            throw 'Usage: /npc <name> [-mode prompt|summary|details|attitude|mission] [-context ...]'
        }
        $npc = Build-NpcObject -NpcKey $npcName

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
            default { $text = Build-NpcPrompt -Npc $npc -Context $context -GoalOverride $goal -SecretOverride $secret }
        }

        Emit-Output -Text $text -Copy $copy -AsJson $json -Type "npc-$mode" -Command $cmd
        break
    }
    '/gm-ask' {
        if ($question -and -not $npcName) {
            $text = Build-GmAskGame -Question $question
            Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'gm-ask-game' -Command $cmd
            break
        }

        if (-not $npcName) {
            throw 'Usage: /gm-ask -game "question" OR /gm-ask -npc <name> [-player <name>] "question"'
        }

        if (-not $question) {
            throw 'Missing question for /gm-ask -npc'
        }

        $npc = Build-NpcObject -NpcKey $npcName
        $text = Build-GmAskNpc -Npc $npc -Question $question -PlayerName $playerName
        Emit-Output -Text $text -Copy $copy -AsJson $json -Type 'gm-ask-npc' -Command $cmd
        break
    }
    default {
        throw "Unknown command '$cmd'. Use /help, /gm, /npc, /gm-ask, /npc-list"
    }
}
