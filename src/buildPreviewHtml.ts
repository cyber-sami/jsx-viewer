/**
 * Builds a self-contained HTML page that:
 *  1. Loads React + ReactDOM from unpkg CDN
 *  2. Loads @babel/standalone from unpkg CDN
 *  3. Transpiles the user's JSX at runtime (in the WebView)
 *  4. Renders the result into #root
 *
 * Component detection order:
 *   - default export  (export default MyComp)
 *   - module.exports.default
 *   - a global named `App`
 */
export function buildPreviewHtml(userCode: string): string {
  // Safely embed user code as a JS string so special chars don't break the page
  const jsonCode = JSON.stringify(userCode);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>JSX Preview</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#fff; }
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

      try {
        var userCode = ${jsonCode};

        // Transpile JSX to plain JS
        var transpiled = Babel.transform(userCode, {
          presets: ['react'],
          filename: 'component.jsx',
        }).code;

        // Rewrite ES module exports to CommonJS so we can eval safely
        var cjs = transpiled
          .replace(/export\\s+default\\s+/g, 'exports.__default = ')
          .replace(/export\\s+\\{([^}]*)\\}/g, function (_, names) {
            return names.split(',').map(function (n) {
              var name = n.trim().split(/\\s+as\\s+/).pop();
              return 'exports.' + name + ' = ' + name + ';';
            }).join('\\n');
          });

        // Evaluate inside a sandboxed function with CommonJS-style env
        var module  = { exports: {} };
        var exports = module.exports;

        // eslint-disable-next-line no-new-func
        new Function('React', 'module', 'exports', cjs)(
          window.React, module, exports
        );

        var Component =
          exports.__default ||
          module.exports.__default ||
          (typeof App !== 'undefined' ? App : undefined);

        if (!Component) {
          throw new Error(
            'No renderable component found.\\n\\n' +
            'Either use "export default" or name your component "App".'
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
