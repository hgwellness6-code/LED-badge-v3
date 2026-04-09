# assets/

Place your app icons here:

| File         | Size     | Platform     |
|--------------|----------|--------------|
| icon.png     | 512×512  | Linux / base |
| icon.ico     | 256×256  | Windows      |
| icon.icns    | —        | macOS        |

## Quick way to generate all formats

```bash
npm install --save-dev electron-icon-builder
npx electron-icon-builder --input=icon.png --output=.
```

This will auto-generate icon.ico and icon.icns from a single PNG.
