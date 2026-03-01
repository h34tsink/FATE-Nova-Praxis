param(
    [switch]$SkipInstall
)

$ErrorActionPreference = 'Stop'

$vaultRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$sourcePath = Join-Path $vaultRoot '_Assets\mcp\nova-praxis-gm-mcp'
$localPath = Join-Path $env:LOCALAPPDATA 'nova-praxis-gm-mcp'

if (-not (Test-Path $sourcePath)) {
    throw "Source MCP project not found: $sourcePath"
}

if (Test-Path $localPath) {
    Remove-Item -Recurse -Force $localPath
}

New-Item -ItemType Directory -Path $localPath | Out-Null
Copy-Item -Path (Join-Path $sourcePath '*') -Destination $localPath -Recurse -Force

if (-not $SkipInstall) {
    Push-Location $localPath
    try {
    try {
      npm install
    } catch {
      Write-Host "Initial npm install failed; cleaning cache and retrying..." -ForegroundColor Yellow
      npm cache clean --force
      npm install
    }
        npm run check
    }
    finally {
        Pop-Location
    }
}

$mcpPath = (Join-Path $localPath 'server.mjs').Replace('\', '/')

$configSnippet = @"
{
  "mcpServers": {
    "nova-praxis-gm": {
      "command": "node",
      "args": [
        "$mcpPath"
      ]
    }
  }
}
"@

Write-Host "Local MCP server synced to: $localPath" -ForegroundColor Green
Write-Host "Run server manually (optional):" -ForegroundColor Cyan
Write-Host ("  node `"{0}\server.mjs`"" -f $localPath) -ForegroundColor DarkCyan
Write-Host "" 
Write-Host "Claude MCP config snippet:" -ForegroundColor Cyan
Write-Host $configSnippet
