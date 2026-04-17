/**
 * Builds a self-contained HTML page that:
 *  1. Loads React + ReactDOM from unpkg CDN
 *  2. Loads @babel/standalone from unpkg CDN
 *  3. Transpiles JSX + transforms ES modules to CJS via Babel
 *  4. Provides a require() shim mapping common packages to CDN globals
 *  5. Renders the default export (or App) into #root
 */
export function buildPreviewHtml(userCode: string): string {
  const jsonCode = JSON.stringify(userCode);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JSX Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; }
    #root { min-height: 100vh; }
    #error-box {
      display: none;
      background: #fff0f0;
      border-left: 4px solid #e53e3e;
      padding: 16px;
      margin: 16px;
      border-radius: 4px;
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 13px;
      color: #742a2a;
    }
  </style>
</head>
<body>
  <div id="error-box"></div>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <script>
    (function () {
      function showError(msg) {
        var box = document.getElementById('error-box');
        box.style.display = 'block';
        box.textContent = String(msg);
      }

      // require() shim: maps common package names to CDN UMD globals
      function require(id) {
        var map = {
          'react':              window.React,
          'react-dom':          window.ReactDOM,
          'react-dom/client':   window.ReactDOM,
          'react/jsx-runtime':  window.React,
          'react/jsx-dev-runtime': window.React,
        };
        if (id in map) return map[id];
        throw new Error('Cannot require "' + id + '" — only React packages are available in the preview.');
      }

      try {
        var userCode = ${jsonCode};

        // Babel transforms JSX *and* converts import/export to CommonJS require/exports
        var transpiled = Babel.transform(userCode, {
          presets: [
            ['env', { targets: { esmodules: true }, modules: 'commonjs' }],
            'react',
          ],
          filename: 'component.jsx',
        }).code;

        var mod = { exports: {} };

        // eslint-disable-next-line no-new-func
        new Function('require', 'module', 'exports', transpiled)(
          require, mod, mod.exports
        );

        var Component =
          mod.exports['default'] ||
          mod.exports;

        // If exports itself is a function/class treat it as the component
        if (typeof Component !== 'function') {
          throw new Error(
            'No renderable component found.\\n\\n' +
            'Make sure you use "export default" on your component.'
          );
        }

        var root = window.ReactDOM.createRoot(document.getElementById('root'));
        root.render(window.React.createElement(Component));

      } catch (err) {
        showError(err);
      }
    })();
  </script>
</body>
</html>`;
}
