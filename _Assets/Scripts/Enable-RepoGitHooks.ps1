[CmdletBinding(SupportsShouldProcess)]
param(
    [string]$RepoPath = (Get-Location).Path,
    [string]$HooksPath = '.githooks'
)

$ErrorActionPreference = 'Stop'

Push-Location $RepoPath
try {
    if (-not (Test-Path '.git')) {
        throw "Not a git repository: $RepoPath"
    }

    if (-not (Test-Path (Join-Path $HooksPath 'pre-push'))) {
        throw "Missing hook file: $(Join-Path $HooksPath 'pre-push')"
    }

    if ($PSCmdlet.ShouldProcess($RepoPath, "Set git core.hooksPath to $HooksPath")) {
        git config core.hooksPath $HooksPath | Out-Null
    }

    if ($PSCmdlet.ShouldProcess((Join-Path $HooksPath 'pre-push'), 'Mark executable in git index')) {
        git update-index --add --chmod=+x (Join-Path $HooksPath 'pre-push') | Out-Null
    }

    $active = git config --get core.hooksPath
    Write-Host "core.hooksPath set to: $active" -ForegroundColor Green
    Write-Host "Pre-push size guard is active." -ForegroundColor Cyan
    Write-Host "Override threshold with env var GIT_MAX_FILE_MB (default 90)." -ForegroundColor DarkCyan
}
finally {
    Pop-Location
}
