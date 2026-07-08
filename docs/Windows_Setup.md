# Windows Setup

This guide is for running StudyMate directly on Windows with PowerShell.

## Install Prerequisites

Install Git:

```powershell
winget install --id Git.Git -e
```

Install Node.js LTS. This includes both `node` and `npm`:

```powershell
winget install --id OpenJS.NodeJS.LTS -e
```

Close and reopen PowerShell, then confirm:

```powershell
node -v
npm -v
```

Install Python 3.12:

```powershell
winget install --id Python.Python.3.12 -e
```

Close and reopen PowerShell, then confirm:

```powershell
py -3.12 --version
```

## Environment Files

Use the existing environment files if they already exist:

- `backend\.env`
- `frontend\.env.local`

Only copy the examples if those files are missing:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env.local
```

Fill the Firebase, Cortex, and frontend values before running the app.

## Backend

First-time setup:

```powershell
.\scripts\setup.ps1
```

Start backend and frontend after setup:

```powershell
.\scripts\start.ps1
```

One-command setup and start, useful for first-run demos:

```powershell
.\scripts\dev.ps1
```

The setup runner checks for Python 3.12, Node.js, and npm. If one is missing, it tries to install it with `winget`. After a new install, reopen PowerShell so PATH updates are loaded, then run setup again.

Or run each app separately:

```powershell
cd backend
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --reload-dir app --port 8000
```

If PowerShell blocks venv activation, run this once for your user account:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then reopen PowerShell and activate the venv again.

## Frontend

Open a second PowerShell window:

```powershell
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The backend runs at:

```text
http://127.0.0.1:8000
```

## Is Google Cloud SDK Required?

No. StudyMate does not require Google Cloud SDK for normal local development.

The backend uses Firebase Admin with service account values from `backend\.env`:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Install Google Cloud SDK only if you personally need `gcloud` for separate tasks such as managing a Google Cloud project, using Application Default Credentials for another tool, or deploying infrastructure. It is not required to run the StudyMate backend or frontend locally.
