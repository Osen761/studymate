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

function Test-CommandExists {
    param([string]$Name)
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Install-WithWinget {
    param(
        [string]$PackageId,
        [string]$DisplayName
    )

    if (-not (Test-CommandExists "winget")) {
        Write-Error "$DisplayName is missing and winget is not available. Install $DisplayName manually, reopen PowerShell, then rerun .\scripts\dev.ps1."
    }

    Write-Host "Installing $DisplayName with winget..."
    winget install --id $PackageId -e
    Write-Host ""
    Write-Host "$DisplayName was installed. Close and reopen PowerShell so PATH updates are loaded, then rerun .\scripts\dev.ps1."
    exit 0
}

function Ensure-Prerequisites {
    if (-not (Test-CommandExists "py")) {
        Install-WithWinget -PackageId "Python.Python.3.12" -DisplayName "Python 3.12"
    }

    try {
        py -3.12 --version | Out-Null
    }
    catch {
        Install-WithWinget -PackageId "Python.Python.3.12" -DisplayName "Python 3.12"
    }

    if (-not (Test-CommandExists "node")) {
        Install-WithWinget -PackageId "OpenJS.NodeJS.LTS" -DisplayName "Node.js LTS"
    }

    if (-not (Test-CommandExists "npm")) {
        Install-WithWinget -PackageId "OpenJS.NodeJS.LTS" -DisplayName "npm"
    }

    Write-Host "Using Python: $(py -3.12 --version)"
    Write-Host "Using Node: $(node --version)"
    Write-Host "Using npm: $(npm --version)"
}

Ensure-Prerequisites

if (-not (Test-Path $BackendEnv)) {
    Write-Error "Missing backend\.env. Create it from backend\.env.example and fill the Firebase/Cortex values."
}

if (-not (Test-Path $FrontendEnv)) {
    Write-Error "Missing frontend\.env.local. Create it from frontend\.env.example and fill the Firebase values."
}

if (-not (Test-Path $BackendVenv)) {
    Write-Host "Creating backend virtual environment..."
    py -3.12 -m venv $BackendVenv
}

Write-Host "Installing backend dependencies..."
& $BackendPython -m pip install -r (Join-Path $BackendDir "requirements.txt")

if (-not (Test-Path $FrontendNodeModules)) {
    Write-Host "Installing frontend dependencies..."
    npm --prefix $FrontendDir install
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
Write-Host "StudyMate is starting:"
Write-Host "  Frontend: http://localhost:$FrontendPort"
Write-Host "  Backend:  http://127.0.0.1:$BackendPort"
Write-Host ""
Write-Host "Close the opened PowerShell server windows to stop the dev servers."
