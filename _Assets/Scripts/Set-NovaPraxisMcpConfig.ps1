[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$ConfigPath = (Join-Path $env:APPDATA 'Claude\claude_desktop_config.json'),
    [string]$ServerName = 'nova-praxis-gm',
    [string]$ServerPath = (Join-Path $env:LOCALAPPDATA 'nova-praxis-gm-mcp\server.mjs')
)

$ErrorActionPreference = 'Stop'

$hadInvalidConfig = $false
$didWriteConfig = $false

$configDir = Split-Path -Parent $ConfigPath
if (-not (Test-Path $configDir)) {
    if ($PSCmdlet.ShouldProcess($configDir, 'Create config directory')) {
        New-Item -ItemType Directory -Path $configDir -Force | Out-Null
    }
}

$config = @{}
if (Test-Path $ConfigPath) {
    $raw = Get-Content -Path $ConfigPath -Raw
    if (-not [string]::IsNullOrWhiteSpace($raw)) {
        try {
            $parsed = $raw | ConvertFrom-Json -AsHashtable
            if ($parsed) {
                $config = $parsed
            }
        }
        catch {
            $hadInvalidConfig = $true
            $config = @{}
        }
    }
}

if (-not $config.ContainsKey('mcpServers') -or -not $config.mcpServers) {
    $config.mcpServers = @{}
}

$mcpPath = $ServerPath.Replace('\', '/')
$config.mcpServers[$ServerName] = @{
    command = 'node'
    args    = @($mcpPath)
}

if (Test-Path $ConfigPath) {
    $timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $backupPath = "$ConfigPath.$timestamp.bak"
    if ($PSCmdlet.ShouldProcess($ConfigPath, "Create backup at $backupPath")) {
        Copy-Item -Path $ConfigPath -Destination $backupPath -Force
    }
}

$json = $config | ConvertTo-Json -Depth 20
if ($PSCmdlet.ShouldProcess($ConfigPath, 'Write MCP server configuration')) {
    Set-Content -Path $ConfigPath -Value $json -Encoding UTF8
    $didWriteConfig = $true
}

if ($hadInvalidConfig) {
    if ($didWriteConfig) {
        Write-Host "Existing config was invalid JSON; wrote a clean config after backup." -ForegroundColor Yellow
    }
    else {
        Write-Host "Existing config is invalid JSON; script would write a clean config after backup." -ForegroundColor Yellow
    }
}

Write-Host "MCP config updated: $ConfigPath" -ForegroundColor Green
Write-Host "Server key: $ServerName" -ForegroundColor Cyan
Write-Host "Server path: $mcpPath" -ForegroundColor Cyan
