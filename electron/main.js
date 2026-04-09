const { app, BrowserWindow, session, Menu, shell, dialog } = require('electron');
const path = require('path');
const isDev = process.argv.includes('--dev');

// ── Keep a global reference so window isn't GC'd ──────────────────────────────
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 820,
    minWidth: 420,
    minHeight: 600,
    title: 'LED Badge S1144',
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // WebHID and WebUSB need these enabled
      enableBlinkFeatures: '',
      webSecurity: true,
    },
    // Use a tinted titlebar on macOS
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
  });

  // ── Load the app ─────────────────────────────────────────────────────────────
  mainWindow.loadFile(path.join(__dirname, '..', 'src', 'index.html'));

  // ── Grant USB/HID device permissions automatically ──────────────────────────
  // This is the key Electron hook that makes WebHID/WebUSB work without
  // the browser permission prompt being blocked.
  session.defaultSession.on('select-hid-device', (event, details, callback) => {
    // Auto-select the first device (LED badge VID 0x0416 / PID 0x5020)
    event.preventDefault();
    const badge = details.deviceList.find(
      d => d.vendorId === 0x0416 && d.productId === 0x5020
    );
    callback(badge ? badge.deviceId : '');
  });

  session.defaultSession.setDevicePermissionHandler((details) => {
    // Allow WebHID for the badge VID/PID
    if (details.deviceType === 'hid') {
      if (details.device.vendorId === 0x0416 && details.device.productId === 0x5020) {
        return true;
      }
    }
    // Allow WebUSB for the same device
    if (details.deviceType === 'usb') {
      if (details.device.vendorId === 0x0416 && details.device.productId === 0x5020) {
        return true;
      }
    }
    return false;
  });

  // Handle USB select (WebUSB path)
  session.defaultSession.on('select-usb-device', (event, details, callback) => {
    event.preventDefault();
    const badge = details.deviceList.find(
      d => d.vendorId === 0x0416 && d.productId === 0x5020
    );
    callback(badge ? badge.deviceId : '');
  });

  // ── Open DevTools in dev mode ─────────────────────────────────────────────
  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => { mainWindow = null; });
}

// ── App menu ──────────────────────────────────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
        ...(isDev ? [{ type: 'separator' }, { role: 'toggleDevTools' }] : [])
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'LED Badge on GitHub',
          click: async () => {
            await shell.openExternal('https://github.com/YOUR_USERNAME/led-badge-s1144');
          }
        },
        {
          label: 'About',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About LED Badge S1144',
              message: 'LED Badge S1144 Controller',
              detail: `Version: ${app.getVersion()}\nElectron: ${process.versions.electron}\nChrome: ${process.versions.chrome}`
            });
          }
        }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── Lifecycle ─────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  buildMenu();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
