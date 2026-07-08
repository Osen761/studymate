$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"
$BackendEnv = Join-Path $BackendDir ".env"
$FrontendEnv = Join-Path $FrontendDir ".env.local"
$BackendVenv = Join-Path $BackendDir ".venv"
$BackendPython = Join-Path $BackendVenv "Scripts\python.exe"
$BackendActivate = Join-Path $BackendVenv "Scripts\Activate.ps1"
$FrontendNodeModules = Join-Path $FrontendDir "node_modules"

if (-not (Test-Path $BackendEnv)) {
    Write-Error "Missing backend\.env. Run .\scripts\setup.ps1 after creating it."
}

if (-not (Test-Path $FrontendEnv)) {
    Write-Error "Missing frontend\.env.local. Run .\scripts\setup.ps1 after creating it."
}

if (-not (Test-Path $BackendPython)) {
    Write-Error "Missing backend virtual environment. Run .\scripts\setup.ps1 first."
}

if (-not (Test-Path $FrontendNodeModules)) {
    Write-Error "Missing frontend\node_modules. Run .\scripts\setup.ps1 first."
}

$BackendPort = if ($env:PORT) { $env:PORT } else { "8000" }
$FrontendPort = if ($env:FRONTEND_PORT) { $env:FRONTEND_PORT } else { "3000" }

Write-Host "Starting backend on http://127.0.0.1:$BackendPort"
$BackendCommand = ". `"$BackendActivate`"; python -m uvicorn app.main:app --reload --reload-dir app --host 127.0.0.1 --port $BackendPort"
$BackendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendCommand -WorkingDirectory $BackendDir -PassThru

Write-Host "Starting frontend on http://localhost:$FrontendPort"
$FrontendCommand = "npm run dev -- --port $FrontendPort"
$FrontendProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendCommand -WorkingDirectory $FrontendDir -PassThru

Write-Host ""
Write-Host "StudyMate is running:"
Write-Host "  Frontend: http://localhost:$FrontendPort"
Write-Host "  Backend:  http://127.0.0.1:$BackendPort"
Write-Host ""
Write-Host "Close the opened PowerShell server windows to stop the dev servers."
