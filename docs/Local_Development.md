# Local Development

## Backend

```bash
cd backend
cp .env.example .env
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
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
