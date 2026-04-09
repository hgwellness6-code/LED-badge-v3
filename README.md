# LED Badge S1144 — Desktop & Android App

> Control your USB LED badge (Model S1144, 11×44 matrix) from **Windows / macOS / Linux** or **Android**.  
> Supports Indic scripts (Gujarati, Devanagari, etc.), scrolling animations, brightness control, and more.

---

## ✨ Features

- **LED preview** — live dot-matrix animation before sending
- **Multi-message slots** — queue up to 8 messages
- **Scroll modes** — Left, Right, Up, Down, Fixed, Snow, etc.
- **Indic script support** — Gujarati, Hindi, and transliteration helper
- **Emoji picker** built-in
- **Message history** — resend recent messages with one tap
- **USB connection** via WebHID (desktop) or WebUSB / OTG (Android)

---

## 🖥 Desktop App (Windows / macOS / Linux)

### Option A — Download pre-built release *(easiest)*

Go to [Releases](../../releases) and download:

| Platform | File |
|----------|------|
| Windows  | `LED-Badge-S1144-Setup-x.x.x.exe` (installer) or `…-portable.exe` |
| macOS    | `LED-Badge-S1144-x.x.x.dmg` |
| Linux    | `LED-Badge-S1144-x.x.x.AppImage` or `.deb` |

On **Linux** you may need to add a udev rule so the app can access the badge without root:

```bash
echo 'SUBSYSTEM=="usb", ATTRS{idVendor}=="0416", ATTRS{idProduct}=="5020", MODE="0666", GROUP="plugdev"' \
  | sudo tee /etc/udev/rules.d/99-led-badge.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
```

### Option B — Run from source

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/led-badge-s1144.git
cd led-badge-s1144

# 2. Install dependencies
npm install

# 3. Run in dev mode
npm start

# 4. (Optional) Build a distributable
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

> **Requires:** Node.js 18+ and npm.

---

## 📱 Android App

The app runs as a **Progressive Web App (PWA)** in Chrome — no Play Store needed.

### Step 1 — Open the PWA

Visit:  
**`https://YOUR_USERNAME.github.io/led-badge-s1144/`**  
in **Chrome for Android** (other browsers don't support WebUSB).

### Step 2 — Add to Home Screen

1. Tap the **⋮ menu** → **Add to Home screen**
2. The app installs like a native app — full-screen, no browser chrome

### Step 3 — Connect the badge via OTG

1. Get a **USB OTG adapter** (USB-C → USB-A or Micro-USB → USB-A depending on your phone)
2. Plug the badge into the OTG adapter, then into your phone
3. In the app tap **📱 WebUSB** button, then **Connect USB**
4. Chrome will ask permission to access the USB device — tap **OK**
5. Done — start sending messages!

> **Note:** Android Chrome 85+ is required. iOS Safari does not support WebUSB.

---

## 🔧 Badge Connection Details

| Detail | Value |
|--------|-------|
| Vendor ID | `0x0416` |
| Product ID | `0x5020` |
| Protocol | USB HID |
| Matrix | 11 rows × 44 columns |

---

## 🏗 Project Structure

```
led-badge-s1144/
├── src/
│   ├── index.html        ← The entire app (self-contained)
│   ├── manifest.json     ← PWA manifest (Android install)
│   └── sw.js             ← Service Worker (offline support)
├── electron/
│   └── main.js           ← Electron wrapper (desktop)
├── .github/
│   └── workflows/
│       └── build.yml     ← CI: auto-build releases + deploy PWA
├── assets/               ← App icons (add icon.png, icon.ico, icon.icns)
├── package.json
└── README.md
```

---

## 🖼 Adding App Icons

Place your icons in the `assets/` folder:

| File | Size | Used for |
|------|------|----------|
| `assets/icon.png` | 512×512 | Linux + GitHub Pages |
| `assets/icon.ico` | 256×256 | Windows |
| `assets/icon.icns` | — | macOS |
| `src/icons/icon-192.png` | 192×192 | Android PWA |
| `src/icons/icon-512.png` | 512×512 | Android PWA |

You can generate all sizes from one PNG using [electron-icon-builder](https://www.npmjs.com/package/electron-icon-builder) or [realfavicongenerator.net](https://realfavicongenerator.net).

---

## 🚀 Releasing a New Version

```bash
# Bump version in package.json, then:
git tag v1.0.1
git push origin v1.0.1
```

GitHub Actions will automatically:
1. Build Windows / macOS / Linux binaries
2. Create a GitHub Release with all files attached
3. Deploy the latest PWA to GitHub Pages

---

## 📄 License

MIT — free to use, modify, and distribute.
