$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $root "backend"
$frontendDir = Join-Path $root "frontend"

$pythonCmd = if (Test-Path "C:/Python313/python.exe") {
    "C:/Python313/python.exe"
} else {
    "python"
}

function Test-Endpoint($url) {
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing
        return $response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

if (-not (Test-Endpoint "http://localhost:8000/health")) {
    Write-Host "Starting backend API..."
    Start-Process powershell -ArgumentList "-NoExit","-Command","Set-Location '$backendDir'; & '$pythonCmd' -m uvicorn app.main:app --host 0.0.0.0 --port 8000" -WorkingDirectory $root
}

if (-not (Test-Endpoint "http://localhost:3000")) {
    Write-Host "Starting frontend app..."
    Start-Process powershell -ArgumentList "-NoExit","-Command","Set-Location '$frontendDir'; npm run dev" -WorkingDirectory $root
}

Start-Sleep -Seconds 4

$backendStatus = if (Test-Endpoint "http://localhost:8000/health") { "online" } else { "offline" }
$frontendStatus = if (Test-Endpoint "http://localhost:3000") { "online" } else { "offline" }

Write-Host ""
Write-Host "Demo stack status:"
Write-Host "- Backend: $backendStatus"
Write-Host "- Frontend: $frontendStatus"
Write-Host ""
Write-Host "Open: http://localhost:3000"
Write-Host "API health: http://localhost:8000/health"
