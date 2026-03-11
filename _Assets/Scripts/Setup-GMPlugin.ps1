# Setup-GMPlugin.ps1
# Sets up the nova-praxis-gm Claude Code plugin on any machine where the vault repo is cloned.
# Run from anywhere — the script auto-detects the vault path from its own location.

param(
    [switch]$Force  # Recreate symlink and re-register even if already present
)

$ErrorActionPreference = 'Stop'

# Resolve paths
$ScriptDir    = Split-Path -Parent $MyInvocation.MyCommand.Path
$VaultRoot    = (Resolve-Path "$ScriptDir\..\..").Path
$PluginSource = Join-Path $VaultRoot 'nova-praxis-gm'
$ClaudeHome   = Join-Path $env:USERPROFILE '.claude'
$PluginsDir   = Join-Path $ClaudeHome 'plugins'
$MarketDir    = Join-Path $PluginsDir 'local-marketplace'
$MarketPlugins = Join-Path $MarketDir 'plugins'
$SymlinkPath  = Join-Path $MarketPlugins 'nova-praxis-gm'
$SettingsFile = Join-Path $ClaudeHome 'settings.json'

Write-Host "Vault root:     $VaultRoot"
Write-Host "Plugin source:  $PluginSource"
Write-Host "Claude home:    $ClaudeHome"
Write-Host ""

# Verify plugin source exists
if (-not (Test-Path (Join-Path $PluginSource 'commands'))) {
    Write-Error "Plugin source not found at $PluginSource. Is the vault cloned correctly?"
    exit 1
}

# Step 1: Create local marketplace directory
if (-not (Test-Path $MarketPlugins)) {
    New-Item -ItemType Directory -Path $MarketPlugins -Force | Out-Null
    Write-Host "[OK] Created local marketplace at $MarketDir"
} else {
    Write-Host "[--] Local marketplace already exists"
}

# Step 2: Create README if missing
$ReadmePath = Join-Path $MarketDir 'README.md'
if (-not (Test-Path $ReadmePath)) {
    Set-Content -Path $ReadmePath -Value 'Local plugin marketplace for Nova Praxis'
    Write-Host "[OK] Created marketplace README"
}

# Step 3: Create symlink from marketplace to vault plugin
if ((Test-Path $SymlinkPath) -and -not $Force) {
    Write-Host "[--] Symlink already exists at $SymlinkPath"
} else {
    if (Test-Path $SymlinkPath) { Remove-Item $SymlinkPath -Force -Recurse }
    New-Item -ItemType SymbolicLink -Path $SymlinkPath -Target $PluginSource | Out-Null
    Write-Host "[OK] Created symlink: $SymlinkPath -> $PluginSource"
}

# Step 4: Register marketplace in settings.json
if (Test-Path $SettingsFile) {
    $settings = Get-Content $SettingsFile -Raw | ConvertFrom-Json
} else {
    $settings = [PSCustomObject]@{}
}

$needsMarketplace = $true
if ($settings.PSObject.Properties['extraKnownMarketplaces']) {
    if ($settings.extraKnownMarketplaces.PSObject.Properties['nova-praxis-local']) {
        $needsMarketplace = $false
        Write-Host "[--] Marketplace already registered in settings.json"
    }
}

if ($needsMarketplace) {
    $marketplaceEntry = [PSCustomObject]@{
        source = [PSCustomObject]@{
            source = 'directory'
            path   = $MarketDir
        }
    }

    if (-not $settings.PSObject.Properties['extraKnownMarketplaces']) {
        $settings | Add-Member -NotePropertyName 'extraKnownMarketplaces' -NotePropertyValue ([PSCustomObject]@{
            'nova-praxis-local' = $marketplaceEntry
        })
    } else {
        $settings.extraKnownMarketplaces | Add-Member -NotePropertyName 'nova-praxis-local' -NotePropertyValue $marketplaceEntry
    }

    $settings | ConvertTo-Json -Depth 10 | Set-Content $SettingsFile -Encoding UTF8
    Write-Host "[OK] Registered nova-praxis-local marketplace in settings.json"
}

# Step 5: Enable plugin in settings.json
$settings = Get-Content $SettingsFile -Raw | ConvertFrom-Json
$needsEnable = $true

if ($settings.PSObject.Properties['enabledPlugins']) {
    if ($settings.enabledPlugins.PSObject.Properties['nova-praxis-gm@nova-praxis-local']) {
        $needsEnable = $false
        Write-Host "[--] Plugin already enabled in settings.json"
    }
}

if ($needsEnable) {
    if (-not $settings.PSObject.Properties['enabledPlugins']) {
        $settings | Add-Member -NotePropertyName 'enabledPlugins' -NotePropertyValue ([PSCustomObject]@{
            'nova-praxis-gm@nova-praxis-local' = $true
        })
    } else {
        $settings.enabledPlugins | Add-Member -NotePropertyName 'nova-praxis-gm@nova-praxis-local' -NotePropertyValue $true
    }

    $settings | ConvertTo-Json -Depth 10 | Set-Content $SettingsFile -Encoding UTF8
    Write-Host "[OK] Enabled nova-praxis-gm in settings.json"
}

# Step 6: Install plugin via Claude CLI
Write-Host ""
Write-Host "Running: claude plugin install nova-praxis-gm@nova-praxis-local"
Write-Host ""

try {
    & claude plugin install nova-praxis-gm@nova-praxis-local
    Write-Host ""
    Write-Host "[OK] Plugin installed successfully"
} catch {
    Write-Host "[!!] Plugin install command failed. You may need to run manually:"
    Write-Host "     claude plugin install nova-praxis-gm@nova-praxis-local"
}

Write-Host ""
Write-Host "Setup complete. Available commands:"
Write-Host "  /gm-start   - Session bootstrap"
Write-Host "  /rules      - Rules oracle"
Write-Host "  /npc        - NPC dialogue"
Write-Host "  /scene      - Scene framing"
Write-Host "  /recap      - Session state summary"
Write-Host "  /aspects    - FATE Aspect generator"
