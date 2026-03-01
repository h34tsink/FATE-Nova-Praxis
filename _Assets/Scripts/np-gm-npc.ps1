param(
    [Parameter(Mandatory = $false)]
    [string]$Npc,

    [Parameter(Mandatory = $false)]
    [string[]]$Context,

    [Parameter(Mandatory = $false)]
    [string]$Goal,

    [Parameter(Mandatory = $false)]
    [string]$Secret,

    [switch]$Copy,
    [switch]$Json,
    [switch]$ShowNpcs
)

$ErrorActionPreference = 'Stop'

$vaultRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')

$npcMap = @{
    'kestrel' = 'GM AI\Entity Cards\Kestrel (R4 Important NPC).md'
    'nowak' = 'GM AI\Entity Cards\Isabella Nowak (R4 Important NPC).md'
    'isabella' = 'GM AI\Entity Cards\Isabella Nowak (R4 Important NPC).md'
    'chimera' = 'GM AI\Entity Cards\Chimera (R5 Villain).md'
    'valare-fork' = 'GM AI\Entity Cards\Valare Fork (R4 Important NPC).md'
    'valare-integrated' = 'GM AI\Entity Cards\Valare Integrated (R4 Personal Agent Ally).md'
    'seren' = 'GM AI\Entity Cards\Seren (R3 Important Contact).md'
    'kal' = 'GM AI\Entity Cards\Kal Paddock (R2 Minor Contact).md'
    'paddock' = 'GM AI\Entity Cards\Kal Paddock (R2 Minor Contact).md'
    'lighthouse' = 'GM AI\Entity Cards\Lighthouse Tactical Controller (R3 Systems Agent).md'
}

if ($ShowNpcs) {
    $npcMap.Keys | Sort-Object -Unique
    exit 0
}

if ([string]::IsNullOrWhiteSpace($Npc)) {
    throw 'Missing -Npc. Example: -Npc valare-integrated'
}

$npcKey = $Npc.Trim().ToLowerInvariant()
if (-not $npcMap.ContainsKey($npcKey)) {
    $valid = ($npcMap.Keys | Sort-Object -Unique) -join ', '
    throw "Unknown NPC key '$Npc'. Valid keys: $valid"
}

$cardRelativePath = $npcMap[$npcKey]
$cardFullPath = Join-Path $vaultRoot $cardRelativePath
if (-not (Test-Path $cardFullPath)) {
    throw "NPC card not found: $cardRelativePath"
}

$cardText = Get-Content $cardFullPath -Raw

function Get-CardValue {
    param(
        [string]$Pattern,
        [string]$Fallback = ''
    )

    $m = [regex]::Match($cardText, $Pattern, [System.Text.RegularExpressions.RegexOptions]::Multiline)
    if ($m.Success) { return $m.Groups[1].Value.Trim() }
    return $Fallback
}

$entityName = Get-CardValue '-\s*Name:\s*(.+)$' $npcKey
$entityClass = Get-CardValue '-\s*Class:\s*(.+)$' 'Important NPC'
$entityRank = Get-CardValue '-\s*Complexity Rank:\s*(.+)$' 'R3'
$goalFromCard = Get-CardValue '-\s*Primary goal:\s*(.+)$' ''
$secretFromCard = Get-CardValue '-\s*Must hide:\s*(.+)$' ''

$goalValue = if (-not [string]::IsNullOrWhiteSpace($Goal)) { $Goal } elseif (-not [string]::IsNullOrWhiteSpace($goalFromCard)) { $goalFromCard } else { '[goal]' }
$secretValue = if (-not [string]::IsNullOrWhiteSpace($Secret)) { $Secret } elseif (-not [string]::IsNullOrWhiteSpace($secretFromCard)) { $secretFromCard } else { '[secret]' }

if (-not $Context -or $Context.Count -eq 0) {
    throw 'Missing -Context. Provide 1-3 scene bullets. Example: -Context "Players repaired her mnemonic core","She demands merger terms first"'
}

$contextLines = $Context | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 3
if ($contextLines.Count -eq 0) {
    throw 'No non-empty context lines provided.'
}

$contextBlock = ($contextLines | ForEach-Object { "- $_" }) -join [Environment]::NewLine

$prompt = @"
You are speaking as: **$entityName**.
Entity class: **$entityClass**.
Complexity rank: **$entityRank**.
Current context:
$contextBlock
What this entity wants right now: **$goalValue**.
What they must avoid revealing: **$secretValue**.

Constraints:
- Stay in-canon using vault notes and extracted PDFs.
- Keep response concise (1-4 lines).
- Match speech style for class + rank.
- Include one Intent line after dialogue.

Return:
1) In-character response
2) Intent: ...
"@

if ($Copy) {
    Set-Clipboard -Value $prompt
}

if ($Json) {
    [pscustomobject]@{
        npc = $npcKey
        cardPath = $cardRelativePath
        entityName = $entityName
        entityClass = $entityClass
        rank = $entityRank
        prompt = $prompt
    } | ConvertTo-Json -Depth 5
} else {
    $prompt
}
