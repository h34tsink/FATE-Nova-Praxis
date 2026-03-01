param(
    [string]$SessionNote,
    [string]$Npc,
    [string]$Objective,
    [string[]]$Scene,
    [switch]$FromDashboard,
    [string]$DashboardName,
    [switch]$NoSeed,
    [switch]$CopyContext
)

$ErrorActionPreference = 'Stop'

$vaultRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$routerPath = Join-Path $vaultRoot '_Assets\Scripts\np-gm-router.ps1'
$aliasesPath = Join-Path $vaultRoot '_Assets\Scripts\np-gm-aliases.ps1'

if (-not (Test-Path $routerPath)) {
    throw "Router script not found: $routerPath"
}

if (-not (Test-Path $aliasesPath)) {
    throw "Alias script not found: $aliasesPath"
}

. $aliasesPath

function Resolve-SessionPath {
    param(
        [string]$InputPath,
        [bool]$PreferDashboard = $false,
        [string]$DashboardFilter = ''
    )

    if (-not [string]::IsNullOrWhiteSpace($InputPath)) {
        if (Test-Path $InputPath) {
            return (Resolve-Path $InputPath).Path
        }

        $combined = Join-Path $vaultRoot $InputPath
        if (Test-Path $combined) {
            return (Resolve-Path $combined).Path
        }

        throw "Session note not found: $InputPath"
    }

    $sessionsDir = Join-Path $vaultRoot 'Sessions'
    if (-not (Test-Path $sessionsDir)) {
        return $null
    }

    if ($PreferDashboard) {
        $dashboardCandidates = Get-ChildItem $sessionsDir -Recurse -File -Filter '*.md' |
            Where-Object { $_.Name -match 'Live Dashboard' }

        if (-not [string]::IsNullOrWhiteSpace($DashboardFilter)) {
            $pattern = [regex]::Escape($DashboardFilter)
            $filtered = $dashboardCandidates | Where-Object {
                $_.FullName -match $pattern -or $_.Name -match $pattern
            }

            $dash = $filtered |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 1
        }

        if (-not $dash) {
            $dash = $dashboardCandidates |
                Sort-Object LastWriteTime -Descending |
                Select-Object -First 1
        }

        if ($dash) {
            return $dash.FullName
        }
    }

    $latest = Get-ChildItem $sessionsDir -Recurse -File -Filter '*.md' |
    Where-Object { $_.Name -ne 'Index.md' } |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

    return if ($latest) { $latest.FullName } else { $null }
}

function Parse-SessionSeed {
    param([string]$Path)

    if ([string]::IsNullOrWhiteSpace($Path) -or -not (Test-Path $Path)) {
        return [pscustomobject]@{
            objective = $null
            scene     = @()
            npc       = $null
        }
    }

    $raw = Get-Content $Path -Raw
    $body = $raw
    if ($body -match '^(?s)---\r?\n.*?\r?\n---\r?\n') {
        $body = [regex]::Replace($body, '^(?s)---\r?\n.*?\r?\n---\r?\n', '')
    }

    $lines = $body -split "`r?`n"

    $objectiveLine = $lines | Where-Object {
        $_ -match '^\s*[-*]?\s*\*\*Goal:\*\*\s*(.+)$' -or
        $_ -match '^\s*[-*]?\s*Goal:\s*(.+)$' -or
        $_ -match '^\s*\*\*Purpose:\*\*\s*(.+)$'
    } | Select-Object -First 1

    $objective = $null
    if ($objectiveLine) {
        if ($objectiveLine -match '^\s*[-*]?\s*\*\*Goal:\*\*\s*(.+)$') { $objective = $matches[1].Trim() }
        elseif ($objectiveLine -match '^\s*[-*]?\s*Goal:\s*(.+)$') { $objective = $matches[1].Trim() }
        elseif ($objectiveLine -match '^\s*\*\*Purpose:\*\*\s*(.+)$') { $objective = $matches[1].Trim() }
    }

    $sectionStart = -1
    for ($i = 0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match '^##\s+(Current Situation|Situation|Live Dashboard|Scene|Opening|Canonical)') {
            $sectionStart = $i
            break
        }
    }

    $sceneCandidates = @()
    if ($sectionStart -ge 0) {
        for ($i = $sectionStart + 1; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match '^##\s+') { break }
            if ($lines[$i] -match '^\s*[-*]\s+(.+)$') {
                $val = $matches[1].Trim()
                if (-not [string]::IsNullOrWhiteSpace($val)) {
                    $sceneCandidates += $val
                }
            }
        }
    }

    if ($sceneCandidates.Count -eq 0) {
        $sceneCandidates = $lines |
        Where-Object { $_ -match '^\s*[-*]\s+(.+)$' } |
        ForEach-Object {
            [regex]::Match($_, '^\s*[-*]\s+(.+)$').Groups[1].Value.Trim()
        } |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    }

    $scene = @($sceneCandidates | Select-Object -First 3)

    $text = $body.ToLowerInvariant()
    $npcKey = $null
    if ($text -match '\bnowak\b') { $npcKey = 'nowak' }
    elseif ($text -match '\bvalare\b') { $npcKey = 'valare-integrated' }
    elseif ($text -match '\bkestrel\b') { $npcKey = 'kestrel' }
    elseif ($text -match '\bchimera\b') { $npcKey = 'chimera' }

    [pscustomobject]@{
        objective = $objective
        scene     = $scene
        npc       = $npcKey
    }
}

$preferDashboard = $FromDashboard -or -not [string]::IsNullOrWhiteSpace($DashboardName)
$sessionPath = Resolve-SessionPath -InputPath $SessionNote -PreferDashboard:$preferDashboard -DashboardFilter $DashboardName
$seed = Parse-SessionSeed -Path $sessionPath

$activeNpc = if (-not [string]::IsNullOrWhiteSpace($Npc)) { $Npc.ToLowerInvariant() } else { $seed.npc }
$activeObjective = if (-not [string]::IsNullOrWhiteSpace($Objective)) { $Objective } else { $seed.objective }
$activeScene = if ($Scene -and $Scene.Count -gt 0) { @($Scene) } else { @($seed.scene) }

if (-not $NoSeed) {
    $args = @('/state-set')

    if (-not [string]::IsNullOrWhiteSpace($activeNpc)) {
        $args += @('-active-npc', $activeNpc)
    }

    if (-not [string]::IsNullOrWhiteSpace($activeObjective)) {
        $args += @('-objective', $activeObjective)
    }

    if ($activeScene -and $activeScene.Count -gt 0) {
        $args += '-scene'
        $args += $activeScene
    }

    & pwsh -File $routerPath @args | Out-Host
}

if ($sessionPath) {
    Write-Host "Session source: $sessionPath" -ForegroundColor DarkCyan
}

if ($CopyContext) {
    & pwsh -File $routerPath /gm -profile full -copy | Out-Host
    Write-Host 'Full GM context copied to clipboard.' -ForegroundColor Cyan
}

& pwsh -File $routerPath /state-show | Out-Host

Write-Host 'Ready: gm | npc | gmask | gmstate' -ForegroundColor Green
Write-Host 'Tip: dot-source this file to keep aliases in your current shell:' -ForegroundColor DarkGray
Write-Host '  . .\_Assets\Scripts\Start-GMSession.ps1' -ForegroundColor DarkGray
