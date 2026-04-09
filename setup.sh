#!/usr/bin/env bash
# setup.sh — Quick-start for LED Badge S1144
set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║   LED Badge S1144 — Setup Script     ║"
echo "╚══════════════════════════════════════╝"
echo ""

# Check Node
if ! command -v node &>/dev/null; then
  echo "❌  Node.js not found. Install it from https://nodejs.org (v18+) and re-run."
  exit 1
fi

NODE_VER=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [ "$NODE_VER" -lt 18 ]; then
  echo "❌  Node.js v18+ required (found v$NODE_VER). Please upgrade."
  exit 1
fi

echo "✅  Node.js $(node -v) found"

# Install dependencies
echo ""
echo "📦  Installing dependencies..."
npm install

echo ""
echo "✅  Done! Run the app with:"
echo ""
echo "    npm start          ← launch desktop app"
echo "    npm run build:linux  ← build Linux AppImage/deb"
echo "    npm run build:win    ← build Windows installer"
echo "    npm run build:mac    ← build macOS dmg"
echo ""

# Linux udev rule
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
  echo "🔌  Linux detected — adding udev rule for USB badge access..."
  RULE='SUBSYSTEM=="usb", ATTRS{idVendor}=="0416", ATTRS{idProduct}=="5020", MODE="0666", GROUP="plugdev"'
  RULE_FILE="/etc/udev/rules.d/99-led-badge.rules"
  if [ ! -f "$RULE_FILE" ]; then
    echo "$RULE" | sudo tee "$RULE_FILE" > /dev/null
    sudo udevadm control --reload-rules && sudo udevadm trigger
    echo "✅  udev rule installed — badge accessible without root."
  else
    echo "✅  udev rule already exists, skipping."
  fi
fi
