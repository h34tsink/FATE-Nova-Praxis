$script:VaultRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$script:RouterPath = Join-Path $script:VaultRoot '_Assets\Scripts\np-gm-router.ps1'

function Invoke-GmRouter {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$RouterArgs)
    & pwsh -NoProfile -File $script:RouterPath @RouterArgs
}

function gm {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    Invoke-GmRouter /gm @Args
}

function npc {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    Invoke-GmRouter /npc @Args
}

function gmask {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    Invoke-GmRouter /gm-ask @Args
}

function gmstate {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Args)
    if (-not $Args -or $Args.Count -eq 0) {
        Invoke-GmRouter /state-show
        return
    }

    $sub = $Args[0].ToLowerInvariant()
    $tail = if ($Args.Count -gt 1) { @($Args[1..($Args.Count - 1)]) } else { @() }
    switch ($sub) {
        'show' {
            Invoke-GmRouter /state-show @tail
        }
        'set' {
            Invoke-GmRouter /state-set @tail
        }
        'clear' {
            Invoke-GmRouter /state-clear @tail
        }
        default {
            Invoke-GmRouter /state-show @Args
        }
    }
}

Write-Host 'Nova Praxis CLI aliases loaded: gm, npc, gmask, gmstate' -ForegroundColor Cyan
Write-Host 'Example: gm -profile full | npc nowak -mode summary | gmask -game "what is legal here?" -domain rules' -ForegroundColor DarkCyan
