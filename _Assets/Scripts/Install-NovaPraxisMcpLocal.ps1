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
        npm install
        npm run check
    }
    finally {
        Pop-Location
    }
}

$configSnippet = @"
{
  "mcpServers": {
    "nova-praxis-gm": {
      "command": "node",
      "args": [
        "$($localPath.Replace('\\', '/'))/server.mjs"
      ]
    }
  }
}
"@

Write-Host "Local MCP server synced to: $localPath" -ForegroundColor Green
Write-Host "Run server manually (optional):" -ForegroundColor Cyan
Write-Host "  node \"$localPath\\server.mjs\"" -ForegroundColor DarkCyan
Write-Host "" 
Write-Host "Claude MCP config snippet:" -ForegroundColor Cyan
Write-Host $configSnippet
