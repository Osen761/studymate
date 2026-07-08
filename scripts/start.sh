#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo "Missing backend/.env. Run ./scripts/setup.sh after creating it."
  exit 1
fi

if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
  echo "Missing frontend/.env.local. Run ./scripts/setup.sh after creating it."
  exit 1
fi

if [ ! -x "$BACKEND_DIR/.venv/bin/python" ]; then
  echo "Missing backend virtual environment. Run ./scripts/setup.sh first."
  exit 1
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "Missing frontend/node_modules. Run ./scripts/setup.sh first."
  exit 1
fi

cleanup() {
  echo
  echo "Stopping StudyMate dev servers..."
  if [ -n "${BACKEND_PID:-}" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "${FRONTEND_PID:-}" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

echo "Starting backend on http://127.0.0.1:${PORT:-8000}"
(
  cd "$BACKEND_DIR"
  source .venv/bin/activate
  ./scripts/dev_server.sh
) &
BACKEND_PID=$!

echo "Starting frontend on http://localhost:${FRONTEND_PORT:-3000}"
(
  cd "$FRONTEND_DIR"
  npm run dev -- --port "${FRONTEND_PORT:-3000}"
) &
FRONTEND_PID=$!

echo
echo "StudyMate is running:"
echo "  Frontend: http://localhost:${FRONTEND_PORT:-3000}"
echo "  Backend:  http://127.0.0.1:${PORT:-8000}"
echo
echo "Press Ctrl+C to stop both servers."

wait "$BACKEND_PID" "$FRONTEND_PID"
