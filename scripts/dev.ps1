$RootDir = Split-Path -Parent $PSScriptRoot

& (Join-Path $RootDir "scripts\setup.ps1")
& (Join-Path $RootDir "scripts\start.ps1")
