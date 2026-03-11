# Start-GM.ps1
# One-shot setup and launch for Nova Praxis GM sessions.
# Run from the vault root. Sets up the plugin if needed, then launches Claude Code.

param(
    [switch]$SetupOnly  # Run setup without launching Claude
)

$ErrorActionPreference = 'Stop'
$VaultRoot = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Nova Praxis GM Launcher" -ForegroundColor Cyan
Write-Host "Vault: $VaultRoot"
Write-Host ""

# --- Plugin Setup ---

$PluginSource  = Join-Path $VaultRoot 'nova-praxis-gm'
$ClaudeHome    = Join-Path $env:USERPROFILE '.claude'
$PluginsDir    = Join-Path $ClaudeHome 'plugins'
$MarketDir     = Join-Path $PluginsDir 'local-marketplace'
$MarketPlugins = Join-Path $MarketDir 'plugins'
$SymlinkPath   = Join-Path $MarketPlugins 'nova-praxis-gm'
$ManifestDir   = Join-Path $MarketDir '.claude-plugin'
$ManifestFile  = Join-Path $ManifestDir 'marketplace.json'
$SettingsFile  = Join-Path $ClaudeHome 'settings.json'
$InstalledFile = Join-Path $PluginsDir 'installed_plugins.json'

# Verify plugin source
if (-not (Test-Path (Join-Path $PluginSource 'commands'))) {
    Write-Error "Plugin source not found at $PluginSource"
    exit 1
}

# Check if already fully installed
$needsSetup = $false
if (-not (Test-Path $ManifestFile)) { $needsSetup = $true }
if (-not (Test-Path $SymlinkPath))  { $needsSetup = $true }
if (Test-Path $InstalledFile) {
    $installed = Get-Content $InstalledFile -Raw | ConvertFrom-Json
    if (-not $installed.plugins.PSObject.Properties['nova-praxis-gm@nova-praxis-local']) {
        $needsSetup = $true
    }
} else {
    $needsSetup = $true
}

if ($needsSetup) {
    Write-Host "Setting up plugin..." -ForegroundColor Yellow

    # Create marketplace directory
    if (-not (Test-Path $MarketPlugins)) {
        New-Item -ItemType Directory -Path $MarketPlugins -Force | Out-Null
    }

    # Create marketplace manifest
    if (-not (Test-Path $ManifestFile)) {
        if (-not (Test-Path $ManifestDir)) {
            New-Item -ItemType Directory -Path $ManifestDir -Force | Out-Null
        }
        @{
            name        = 'nova-praxis-local'
            description = 'Local plugins for Nova Praxis TTRPG campaign'
            owner       = @{ name = 'Sean'; email = 'local@localhost' }
            plugins     = @(
                @{
                    name        = 'nova-praxis-gm'
                    description = 'GM cockpit for running Nova Praxis TTRPG sessions'
                    version     = '1.0.0'
                    source      = './plugins/nova-praxis-gm'
                    category    = 'productivity'
                }
            )
        } | ConvertTo-Json -Depth 5 | Set-Content $ManifestFile -Encoding UTF8
        Write-Host "  [OK] Marketplace manifest created"
    }

    # Create symlink
    if (-not (Test-Path $SymlinkPath)) {
        New-Item -ItemType SymbolicLink -Path $SymlinkPath -Target $PluginSource | Out-Null
        Write-Host "  [OK] Symlink created"
    }

    # Register marketplace in settings.json
    if (Test-Path $SettingsFile) {
        $settings = Get-Content $SettingsFile -Raw | ConvertFrom-Json
    } else {
        $settings = [PSCustomObject]@{}
    }

    $dirty = $false

    # Add marketplace
    if (-not $settings.PSObject.Properties['extraKnownMarketplaces']) {
        $settings | Add-Member -NotePropertyName 'extraKnownMarketplaces' -NotePropertyValue ([PSCustomObject]@{
            'nova-praxis-local' = [PSCustomObject]@{
                source = [PSCustomObject]@{ source = 'directory'; path = $MarketDir }
            }
        })
        $dirty = $true
    } elseif (-not $settings.extraKnownMarketplaces.PSObject.Properties['nova-praxis-local']) {
        $settings.extraKnownMarketplaces | Add-Member -NotePropertyName 'nova-praxis-local' -NotePropertyValue ([PSCustomObject]@{
            source = [PSCustomObject]@{ source = 'directory'; path = $MarketDir }
        })
        $dirty = $true
    }

    # Enable plugin
    if (-not $settings.PSObject.Properties['enabledPlugins']) {
        $settings | Add-Member -NotePropertyName 'enabledPlugins' -NotePropertyValue ([PSCustomObject]@{
            'nova-praxis-gm@nova-praxis-local' = $true
        })
        $dirty = $true
    } elseif (-not $settings.enabledPlugins.PSObject.Properties['nova-praxis-gm@nova-praxis-local']) {
        $settings.enabledPlugins | Add-Member -NotePropertyName 'nova-praxis-gm@nova-praxis-local' -NotePropertyValue $true
        $dirty = $true
    }

    if ($dirty) {
        $settings | ConvertTo-Json -Depth 10 | Set-Content $SettingsFile -Encoding UTF8
        Write-Host "  [OK] settings.json updated"
    }

    # Install plugin
    Write-Host "  Installing plugin..."
    & claude plugin install nova-praxis-gm@nova-praxis-local 2>&1 | ForEach-Object {
        if ($_ -match 'success|installed') { Write-Host "  [OK] Plugin installed" -ForegroundColor Green }
        elseif ($_ -match 'already') { Write-Host "  [--] Plugin already installed" }
        elseif ($_ -match 'fail|error') { Write-Host "  [!!] $_" -ForegroundColor Red }
    }

    Write-Host ""
} else {
    Write-Host "Plugin ready." -ForegroundColor Green
    Write-Host ""
}

# --- Launch Claude Code ---

if ($SetupOnly) {
    Write-Host "Setup complete. Run without -SetupOnly to launch Claude Code."
    exit 0
}

Write-Host "Launching Claude Code..." -ForegroundColor Cyan
Write-Host "  /gm-start  - Bootstrap session"
Write-Host "  /rules     - Rules oracle"
Write-Host "  /npc       - NPC dialogue"
Write-Host "  /scene     - Scene framing"
Write-Host "  /recap     - Session state"
Write-Host "  /aspects   - Aspect generator"
Write-Host ""

Set-Location $VaultRoot
& claude
