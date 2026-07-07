#!/usr/bin/env bash
set -euo pipefail

export WATCHFILES_FORCE_POLLING="${WATCHFILES_FORCE_POLLING:-true}"

exec uvicorn app.main:app \
  --reload \
  --reload-dir app \
  --host "${HOST:-127.0.0.1}" \
  --port "${PORT:-8000}"
