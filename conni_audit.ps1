param(
  [string]$Root = (Get-Location).Path,
  [int]$TopN = 25
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-RelPath([string]$full, [string]$root) {
  if ($full.StartsWith($root, [System.StringComparison]::OrdinalIgnoreCase)) {
    return $full.Substring($root.Length).TrimStart('\')
  }
  return $full
}

$md = Get-ChildItem -Path $Root -Recurse -File -Filter *.md |
  Where-Object { $_.FullName -notmatch '\\.trash\\' }

$summary = [ordered]@{}
$summary.mdFiles = $md.Count

# Naming signals
$summary.filesWithUnderscoresInName = @($md | Where-Object { $_.Name -match '_' }).Count
$summary.filesWithAllCapsBaseName = @($md | Where-Object {
  $_.BaseName -cmatch '^[A-Z0-9_ -]+$' -and $_.BaseName -match '[A-Z]' -and $_.BaseName -notmatch '[a-z]'
}).Count
$summary.filesWithBracketCharsInName = @($md | Where-Object { $_.Name -match '\\[|\\]' }).Count

# Content signals
$yamlFrontmatterStarts = 0
$inlineTagFiles = 0
$wikilinkFiles = 0
$aliasesFiles = 0
$codeFenceFiles = 0
$h2Counts = @{}

foreach ($f in $md) {
  $first = $null
  try { $first = Get-Content -LiteralPath $f.FullName -TotalCount 1 -ErrorAction Stop } catch { continue }
  if ($first -eq '---') { $yamlFrontmatterStarts++ }

  $raw = $null
  try { $raw = Get-Content -LiteralPath $f.FullName -Raw -ErrorAction Stop } catch { continue }
  if ([string]::IsNullOrEmpty($raw)) { continue }

  if ($raw -match '(?m)^#\w[\w/-]*') { $inlineTagFiles++ }
  if ($raw -match '\[\[[^\]]+\]\]') { $wikilinkFiles++ }
  if ($raw -match '(?m)^aliases\s*:') { $aliasesFiles++ }
  if ($raw -match '(?m)^```') { $codeFenceFiles++ }

  foreach ($m in [regex]::Matches($raw, '(?m)^##\s+(.+?)\s*$')) {
    $k = $m.Groups[1].Value
    if (-not $h2Counts.ContainsKey($k)) { $h2Counts[$k] = 0 }
    $h2Counts[$k]++
  }
}

$summary.yamlFrontmatterStarts = $yamlFrontmatterStarts
$summary.filesWithInlineTags = $inlineTagFiles
$summary.filesWithWikilinks = $wikilinkFiles
$summary.filesWithAliasesField = $aliasesFiles
$summary.filesWithCodeFences = $codeFenceFiles

# Folder distribution (top-level)
$top = $md | ForEach-Object {
  $rel = Get-RelPath $_.FullName $Root
  ($rel -split '\\')[0]
} | Group-Object | Sort-Object Count -Descending
$summary.topFolders = $top | Select-Object -First 20 | ForEach-Object {
  [pscustomobject]@{ name = $_.Name; count = $_.Count }
}

# Duplicate basenames (case-insensitive)
$dupes = $md | Group-Object { $_.BaseName.ToLowerInvariant() } |
  Where-Object { $_.Count -gt 1 } |
  Sort-Object Count -Descending
$summary.duplicateBasenames = $dupes.Count
$summary.topDuplicateBasenames = $dupes | Select-Object -First 15 | ForEach-Object {
  [pscustomobject]@{
    base = $_.Name
    count = $_.Count
    files = ($_.Group | Select-Object -First 10 | ForEach-Object { Get-RelPath $_.FullName $Root })
  }
}

# Top H2 headings
$summary.topH2Headings = $h2Counts.GetEnumerator() |
  Sort-Object Value -Descending |
  Select-Object -First $TopN |
  ForEach-Object { [pscustomobject]@{ heading = $_.Name; count = $_.Value } }

$summary | ConvertTo-Json -Depth 6
