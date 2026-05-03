# JSX Viewer

An Android app that lets you paste or import a `.jsx` file, transpiles it in-app using Babel, and renders the result live in a WebView.

## Features

- Paste JSX code directly or import a `.jsx` / `.tsx` / `.js` file
- In-app Babel transpilation (no server needed)
- Live preview rendered in a WebView
- Handles `import` statements for React hooks and components
- Clean dark-themed editor UI

## Download

Grab the latest APK from the [Releases](../../releases) page.

## Development

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [EAS CLI](https://docs.expo.dev/build/setup/) for building APKs

### Run locally

```bash
npm install
npx expo start
```

### Build APK

```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

Or push to `main` — GitHub Actions will build and attach the APK to a release automatically.

## How it works

1. You write or paste JSX in the editor
2. The code is passed to a WebView as an embedded HTML page
3. Inside the WebView, `@babel/standalone` transpiles the JSX and converts ES module imports to CommonJS
4. A `require()` shim maps `react` / `react-dom` imports to the UMD globals loaded from CDN
5. The component is rendered into `#root` via `ReactDOM.createRoot`

## CI / CD

Builds are triggered automatically on every push to `main` via [EAS Build](https://docs.expo.dev/build/introduction/).

To set up the workflow in your own fork:

1. Create an [Expo access token](https://expo.dev/accounts/cybersamiorg/settings/access-tokens)
2. Add it as a GitHub secret named `EXPO_TOKEN`
3. Push to `main` — the workflow builds the APK and attaches it to a GitHub Release

## License

MIT
