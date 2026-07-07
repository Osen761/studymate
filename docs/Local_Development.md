# Local Development

## Backend

```bash
cd backend
cp .env.example .env
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
cp .env.example .env.local
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
