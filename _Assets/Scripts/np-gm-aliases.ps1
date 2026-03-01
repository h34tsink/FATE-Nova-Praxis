$script:VaultRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$script:RouterPath = Join-Path $script:VaultRoot '_Assets\Scripts\np-gm-router.ps1'

function gm {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    & pwsh -File $script:RouterPath /gm @Args
}

function npc {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    & pwsh -File $script:RouterPath /npc @Args
}

function gmask {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    & pwsh -File $script:RouterPath /gm-ask @Args
}

function gmstate {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    if (-not $Args -or $Args.Count -eq 0) {
        & pwsh -File $script:RouterPath /state-show
        return
    }

    $sub = $Args[0].ToLowerInvariant()
    $tail = if ($Args.Count -gt 1) { @($Args[1..($Args.Count - 1)]) } else { @() }
    switch ($sub) {
        'show' {
            & pwsh -File $script:RouterPath /state-show @tail
        }
        'set' {
            & pwsh -File $script:RouterPath /state-set @tail
        }
        'clear' {
            & pwsh -File $script:RouterPath /state-clear @tail
        }
        default {
            & pwsh -File $script:RouterPath /state-show @Args
        }
    }
}

Write-Host 'Nova Praxis CLI aliases loaded: gm, npc, gmask, gmstate' -ForegroundColor Cyan
Write-Host 'Example: gm -profile full | npc nowak -mode summary | gmask -game "what is legal here?" -domain rules' -ForegroundColor DarkCyan
