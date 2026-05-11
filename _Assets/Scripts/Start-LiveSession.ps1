<#
.SYNOPSIS
  Bootstraps a Nova Praxis live-capture session.

.DESCRIPTION
  1. Verifies python + claude CLI are on PATH.
  2. (Re)builds the vault index.
  3. Lets you pick an audio device (cached after first run).
  4. Spawns live_capture.py and event_dispatcher.py side by side.
  5. Cleans up child processes on Ctrl+C.

.EXAMPLE
  pwsh _Assets/Scripts/Start-LiveSession.ps1 -Session 9

.EXAMPLE
  pwsh _Assets/Scripts/Start-LiveSession.ps1 -Session 10 -Device 5 -BatchSeconds 20
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)] [int]$Session,
    [int]$Device = -1,
    [string]$WhisperModel = "small.en",
    [string]$ClaudeModel = "claude-sonnet-4-6",
    [string]$CorrectionModel = "claude-haiku-4-5-20251001",
    [double]$BatchSeconds = 30,
    [double]$ChunkSeconds = 8,
    [switch]$SkipIndex,
    [switch]$ListDevices
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$vaultRoot = Split-Path -Parent (Split-Path -Parent $scriptDir)
$cacheDir = Join-Path $vaultRoot "_Assets/Cache"
$audioCfg = Join-Path $cacheDir "audio_device.json"

function Test-Command($name) {
    return $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

Write-Host "[live] vault: $vaultRoot" -ForegroundColor Cyan

if (-not (Test-Command "python")) { throw "python not found on PATH" }
if (-not (Test-Command "claude")) { throw "claude CLI not found on PATH (install via Claude Code)" }

if ($ListDevices) {
    python (Join-Path $scriptDir "live_capture.py") --list-devices
    exit 0
}

if (-not $SkipIndex) {
    Write-Host "[live] building vault index..." -ForegroundColor Cyan
    python (Join-Path $scriptDir "vault_index.py")
    if ($LASTEXITCODE -ne 0) { throw "vault_index.py failed" }
}

# Resolve audio device
if ($Device -lt 0) {
    if (Test-Path $audioCfg) {
        $cached = Get-Content $audioCfg -Raw | ConvertFrom-Json
        $Device = [int]$cached.device
        Write-Host "[live] using cached audio device $Device" -ForegroundColor Cyan
    } else {
        Write-Host "[live] no device cached. listing input devices:" -ForegroundColor Yellow
        python (Join-Path $scriptDir "live_capture.py") --list-devices
        $picked = Read-Host "Enter device index"
        $Device = [int]$picked
        New-Item -ItemType Directory -Force -Path $cacheDir | Out-Null
        @{ device = $Device } | ConvertTo-Json | Set-Content $audioCfg -Encoding UTF8
    }
}

$sessDir = Join-Path $vaultRoot "Sessions/Session $Session"
New-Item -ItemType Directory -Force -Path $sessDir | Out-Null

# Ensure stub files exist so Obsidian opens them cleanly
$transcript = Join-Path $sessDir "Live Transcript.md"
$dashboard = Join-Path $sessDir "Live Dashboard.md"
if (-not (Test-Path $transcript)) { "# Session $Session — Live Transcript`n" | Set-Content $transcript -Encoding UTF8 }
if (-not (Test-Path $dashboard)) { "# Session $Session — Live Dashboard`n" | Set-Content $dashboard -Encoding UTF8 }

Write-Host "[live] starting capture (device $Device, model $WhisperModel)..." -ForegroundColor Green
$capture = Start-Process -PassThru -NoNewWindow python @(
    (Join-Path $scriptDir "live_capture.py"),
    "--session", $Session,
    "--device", $Device,
    "--model", $WhisperModel,
    "--chunk-seconds", $ChunkSeconds
)

Start-Sleep -Seconds 2
Write-Host "[live] starting dispatcher (batch ${BatchSeconds}s, model $ClaudeModel)..." -ForegroundColor Green
$dispatch = Start-Process -PassThru -NoNewWindow python @(
    (Join-Path $scriptDir "event_dispatcher.py"),
    "--session", $Session,
    "--batch-seconds", $BatchSeconds,
    "--model", $ClaudeModel,
    "--correction-model", $CorrectionModel
)

Write-Host ""
Write-Host "[live] running. Ctrl+C to stop both processes." -ForegroundColor Cyan
Write-Host "[live] pause dashboard updates: touch '$sessDir/.dashboard_paused'" -ForegroundColor DarkGray
Write-Host "[live] resume: delete that file" -ForegroundColor DarkGray
Write-Host ""

try {
    while (-not $capture.HasExited -and -not $dispatch.HasExited) {
        Start-Sleep -Seconds 1
    }
} finally {
    foreach ($p in @($capture, $dispatch)) {
        if ($p -and -not $p.HasExited) {
            try { Stop-Process -Id $p.Id -Force -ErrorAction SilentlyContinue } catch {}
        }
    }
    Write-Host "[live] stopped." -ForegroundColor Cyan
}
