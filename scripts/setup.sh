#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

install_with_package_manager() {
  local package_kind="$1"

  if command -v apt-get >/dev/null 2>&1; then
    echo "Installing $package_kind with apt. You may be asked for your password..."
    sudo apt-get update
    if [ "$package_kind" = "python" ]; then
      sudo apt-get install -y python3 python3-venv python3-pip
    else
      sudo apt-get install -y nodejs npm
    fi
    return
  fi

  if command -v dnf >/dev/null 2>&1; then
    echo "Installing $package_kind with dnf. You may be asked for your password..."
    if [ "$package_kind" = "python" ]; then
      sudo dnf install -y python3 python3-pip
    else
      sudo dnf install -y nodejs npm
    fi
    return
  fi

  if command -v pacman >/dev/null 2>&1; then
    echo "Installing $package_kind with pacman. You may be asked for your password..."
    if [ "$package_kind" = "python" ]; then
      sudo pacman -Sy --needed python python-pip
    else
      sudo pacman -Sy --needed nodejs npm
    fi
    return
  fi

  if command -v brew >/dev/null 2>&1; then
    echo "Installing $package_kind with Homebrew..."
    if [ "$package_kind" = "python" ]; then
      brew install python
    else
      brew install node
    fi
    return
  fi

  echo "Could not find apt, dnf, pacman, or Homebrew to install $package_kind automatically."
  if [ "$package_kind" = "python" ]; then
    echo "Install Python 3.12, then rerun ./scripts/setup.sh."
  else
    echo "Install Node.js LTS from https://nodejs.org, then rerun ./scripts/setup.sh."
  fi
  exit 1
}

ensure_prerequisites() {
  if ! command -v python3 >/dev/null 2>&1; then
    install_with_package_manager "python"
  fi

  if ! python3 -m venv --help >/dev/null 2>&1; then
    echo "Python venv support is missing."
    install_with_package_manager "python"
  fi

  if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    install_with_package_manager "node"
  fi

  echo "Using Python: $(python3 --version)"
  echo "Using Node: $(node --version)"
  echo "Using npm: $(npm --version)"
}

ensure_prerequisites

if [ ! -f "$BACKEND_DIR/.env" ]; then
  echo "Missing backend/.env. Create it from backend/.env.example and fill the Firebase/Cortex values."
  exit 1
fi

if [ ! -f "$FRONTEND_DIR/.env.local" ]; then
  echo "Missing frontend/.env.local. Create it from frontend/.env.example and fill the Firebase values."
  exit 1
fi

if [ ! -d "$BACKEND_DIR/.venv" ]; then
  echo "Creating backend virtual environment..."
  python3 -m venv "$BACKEND_DIR/.venv"
fi

echo "Installing backend dependencies..."
"$BACKEND_DIR/.venv/bin/python" -m pip install -r "$BACKEND_DIR/requirements.txt"

echo "Installing frontend dependencies..."
npm --prefix "$FRONTEND_DIR" install

echo
echo "StudyMate setup complete."
echo "Start both servers with: ./scripts/start.sh"
