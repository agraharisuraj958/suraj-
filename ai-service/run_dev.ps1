$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

function Read-EnvValue {
    param(
        [string]$Path,
        [string]$Key,
        [string]$DefaultValue
    )

    if (-not (Test-Path $Path)) {
        return $DefaultValue
    }

    foreach ($line in Get-Content $Path) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith('#')) {
            continue
        }

        if ($trimmed -match "^$([regex]::Escape($Key))\s*=") {
            $value = $trimmed.Split('=', 2)[1].Trim()
            return $value.Trim('"').Trim("'")
        }
    }

    return $DefaultValue
}

$envHost = Read-EnvValue -Path (Join-Path $scriptDir '.env') -Key 'AI_SERVICE_HOST' -DefaultValue '127.0.0.1'
$configuredPort = [int](Read-EnvValue -Path (Join-Path $scriptDir '.env') -Key 'AI_SERVICE_PORT' -DefaultValue '8000')

$chosenPort = $configuredPort
for ($candidate = $configuredPort; $candidate -lt ($configuredPort + 20); $candidate++) {
    $existing = Get-NetTCPConnection -LocalPort $candidate -ErrorAction SilentlyContinue
    if (-not $existing) {
        $chosenPort = $candidate
        break
    }

    $processes = $existing | Select-Object -ExpandProperty OwningProcess -Unique | ForEach-Object {
        Get-Process -Id $_ -ErrorAction SilentlyContinue
    }

    Write-Host "Port $candidate is already used by:" -ForegroundColor Yellow
    if ($processes) {
        $processes | Select-Object Id, ProcessName, Path | Format-Table -AutoSize
    } else {
        Write-Host "Process information unavailable."
    }

    $answer = Read-Host "Kill the process and use port $candidate? [Y/N] (default: N = try the next free port)"
    if ($answer -match '^(y|yes)$') {
        foreach ($process in $processes) {
            if ($process) {
                Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            }
        }
        $chosenPort = $candidate
        break
    }

    Write-Host "Trying the next free port..." -ForegroundColor DarkGray
}

if (-not $chosenPort) {
    throw "No free port was found in the selected range."
}

$env:AI_SERVICE_HOST = $envHost
$env:AI_SERVICE_PORT = [string]$chosenPort

$qdrantLockPath = Join-Path $scriptDir 'data\qdrant\.lock'
if (Test-Path $qdrantLockPath) {
    $lockPort = Get-NetTCPConnection -LocalPort $chosenPort -ErrorAction SilentlyContinue
    if (-not $lockPort) {
        Remove-Item $qdrantLockPath -Force -ErrorAction SilentlyContinue
        Write-Host "Removed stale Qdrant lock before startup." -ForegroundColor DarkGray
    }
}

$finalUrl = "http://$($envHost):$chosenPort"
Write-Host "Starting AI service on $finalUrl" -ForegroundColor Green
Write-Host "Docs URL: $finalUrl/docs" -ForegroundColor Green

& "$scriptDir\.venv\Scripts\python.exe" -m uvicorn app.main:app --host $envHost --port $chosenPort --reload
