# Local Development

Use this guide for Linux, macOS, or WSL. For native Windows PowerShell, see [Windows Setup](Windows_Setup.md).

## Prerequisites

- Python 3.12
- Node.js LTS, which includes `npm`
- Git

Google Cloud SDK is optional. StudyMate uses Firebase service account values from `backend/.env`; it does not require `gcloud` or Application Default Credentials to run locally.

## Backend

First-time setup:

```bash
./scripts/setup.sh
```

Start backend and frontend after setup:

```bash
./scripts/start.sh
```

One-command setup and start, useful for first-run demos:

```bash
./scripts/dev.sh
```

The setup runner checks for Python, Node.js, and npm. If one is missing, it tries to install it with `apt`, `dnf`, `pacman`, or Homebrew.

Or run each app separately:

```bash
cd backend
[ -f .env ] || cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
./scripts/dev_server.sh
```

The dev script runs Uvicorn with reload polling enabled and watches only `app/`.
That avoids Linux inotify exhaustion errors such as `OS file watch limit reached`.

If you want to raise the Linux watch limits instead, run:

```bash
echo fs.inotify.max_user_watches=524288 | sudo tee /etc/sysctl.d/99-studymate-inotify.conf
echo fs.inotify.max_user_instances=1024 | sudo tee -a /etc/sysctl.d/99-studymate-inotify.conf
sudo sysctl --system
```

Run tests:

```bash
cd backend
pytest
```

## Frontend

```bash
cd frontend
[ -f .env.local ] || cp .env.example .env.local
npm install
npm run dev
```

Run checks:

```bash
npm run typecheck
npm run build
```

## Docker

```bash
docker compose up --build
```

The backend persists ChromaDB vectors in the `chroma-data` Docker volume.

## Private Key Newlines

Store `FIREBASE_PRIVATE_KEY` with escaped newlines in `.env`. The backend converts `\\n` into real newlines before initializing Firebase Admin.
