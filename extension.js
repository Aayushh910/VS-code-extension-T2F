const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

function activate(context) {

    let disposable = vscode.commands.registerCommand('testext.generate', function () {

        const panel = vscode.window.createWebviewPanel(
            'treeInput',
            'Tree to Folder Generator',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = getWebviewContent();

        panel.webview.onDidReceiveMessage(message => {

            if (message.command === 'generate') {

                const input = message.text;

                if (!input) {
                    panel.webview.postMessage({ command: 'error', text: 'No input provided' });
                    return;
                }

                if (!vscode.workspace.workspaceFolders) {
                    panel.webview.postMessage({ command: 'error', text: 'Open a folder first!' });
                    return;
                }

                const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

                const lines = input.split('\n');

                let stack = [];

                try {

                    for (let line of lines) {

                        if (!line.trim()) continue;

                        // Match tree line
                        const match = line.match(/^(.*?)(├──|└──)\s*(.+)$/);
                        if (!match) continue;

                        const prefix = match[1];
                        const name = match[3].trim();

                        if (!name) continue;

                        // Calculate level (indent groups)
                        const level = (prefix.match(/│   |    /g) || []).length;

                        // Prevent nesting under files
                        if (stack[level - 1] && stack[level - 1].includes('.')) {
                            stack[level - 1] = undefined;
                        }

                        // Update stack
                        stack[level] = name;
                        stack = stack.slice(0, level + 1);

                        const parentParts = stack.slice(0, level).filter(Boolean);
                        const parentPath = path.join(rootPath, ...parentParts);

                        const fullPath = path.join(parentPath, name);

                        if (name.includes('.')) {
                            fs.mkdirSync(parentPath, { recursive: true });
                            if (!fs.existsSync(fullPath)) {
                                fs.writeFileSync(fullPath, '');
                            }
                        } else {
                            fs.mkdirSync(fullPath, { recursive: true });
                        }
                    }

                    panel.webview.postMessage({
                        command: 'success',
                        text: 'Structure created successfully!'
                    });

                } catch (err) {
                    panel.webview.postMessage({
                        command: 'error',
                        text: err.message
                    });
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 10px;
                background-color: #1e1e1e;
                color: #ffffff;
                height: 100vh;
                display: flex;
                flex-direction: column;
            }

            h2 {
                color: #4CAF50;
                margin-top: 0;
            }

            .top {
                flex: 0 0 auto;
            }

            .textarea-container {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            textarea {
                flex: 1;
                width: 100%;
                background: #2d2d2d;
                color: #ffffff;
                border: 1px solid #555;
                padding: 10px;
                font-family: monospace;
                font-size: 14px;
                border-radius: 5px;
                resize: none;
            }

            button {
                margin-top: 10px;
                background-color: #4CAF50;
                color: white;
                padding: 10px;
                border: none;
                border-radius: 5px;
                font-size: 16px;
                cursor: pointer;
                width: 100%;
            }

            button:disabled {
                background-color: #888;
            }

            .box {
                background: #2d2d2d;
                padding: 8px;
                border-radius: 5px;
                margin-bottom: 8px;
                font-size: 13px;
            }

            .warning {
                color: #ffcc00;
            }

            .success {
                color: #00ff99;
                margin-top: 5px;
            }

            .error {
                color: #ff5555;
                margin-top: 5px;
            }

            pre {
                margin: 0;
                font-size: 12px;
                overflow-x: auto;
            }

            code {
                color: #00d9ff;
            }
        </style>
    </head>

    <body>

        <div class="top">

            <h2>📂 Tree Generator</h2>

            <div class="box">
                <strong>📌 Rules:</strong><br>
                Use <code>├──</code>, <code>└──</code>, <code>│</code> properly
            </div>

            <div class="box">
                <strong>Example:</strong>
                <pre>
├── app/
│   ├── main.py
│   └── routes/
│       └── auth.py
                </pre>
            </div>

            <div class="box warning">
                ⚠️ Wrong format may fail
            </div>

        </div>

        <div class="textarea-container">
            <textarea id="tree" placeholder="Paste your tree structure..."></textarea>

            <button id="btn" onclick="generate()">Generate</button>

            <div id="status"></div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();

            function generate() {
                const text = document.getElementById('tree').value;

                const btn = document.getElementById('btn');
                const status = document.getElementById('status');

                btn.disabled = true;
                status.className = '';
                status.innerText = "⏳ Generating...";

                vscode.postMessage({
                    command: 'generate',
                    text: text
                });
            }

            window.addEventListener('message', event => {
                const msg = event.data;
                const btn = document.getElementById('btn');
                const status = document.getElementById('status');

                btn.disabled = false;

                if (msg.command === 'success') {
                    status.className = 'success';
                    status.innerText = "✅ " + msg.text;
                }

                if (msg.command === 'error') {
                    status.className = 'error';
                    status.innerText = "❌ " + msg.text;
                }
            });
        </script>

    </body>
    </html>
    `;
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};