"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.macroList = void 0;
const vscode = require("vscode");
exports.macroList = [
    {
        name: "sql",
        children: [
            {
                name: "select",
                key: "sel;",
                description: "SELECT * FROM ",
                command: "vsmacro.select",
            },
            {
                name: "insert",
                key: "ins;",
                description: "INSERT INTO ",
                command: "vsmacro.insert",
            },
            {
                name: "update",
                key: "upd;",
                description: "UPDATE ",
                command: "vsmacro.update",
            },
            {
                name: "delete",
                key: "del;",
                description: "DELETE FROM ",
                command: "vsmacro.delete",
            },
        ],
    },
    {
        name: "common",
        children: [
            {
                name: "console.log",
                key: "log;",
                description: "console.log( )",
                command: "vsmacro.log",
            },
        ],
    },
];
function activate(context) {
    let start = vscode.commands.registerCommand("vsmacro.start", () => {
        vscode.window.showInformationMessage("Macro started!");
    });
    vscode.window.onDidChangeTextEditorSelection(() => {
        const cursorPosition = vscode.window.activeTextEditor?.selection.active;
        if (cursorPosition) {
            const pos = new vscode.Range(new vscode.Position(cursorPosition?.line || 0, cursorPosition.character - 4), cursorPosition);
            for (let i = 0; i < exports.macroList.length; i++) {
                for (let j = 0; j < exports.macroList[i].children.length; j++) {
                    if (vscode.window.activeTextEditor?.document
                        .getText(pos)
                        .includes(exports.macroList[i].children[j].key)) {
                        setTimeout(() => {
                            vscode.window.activeTextEditor?.edit((editBuilder) => {
                                const cursorPosition = vscode.window.activeTextEditor?.selection.active;
                                if (cursorPosition) {
                                    editBuilder.insert(cursorPosition, exports.macroList[i].children[j].description);
                                }
                            });
                        }, 50);
                        vscode.window.activeTextEditor?.edit((editBuilder) => {
                            editBuilder.delete(pos);
                        });
                    }
                }
            }
        }
    });
    let arr = exports.macroList.map((macro) => {
        return macro.children.map((child) => {
            return vscode.commands.registerCommand(child.command, () => {
                vscode.window.activeTextEditor?.edit((editBuilder) => {
                    const cursorPosition = vscode.window.activeTextEditor?.selection.active;
                    if (cursorPosition) {
                        editBuilder.insert(cursorPosition, child.description);
                    }
                });
            });
        });
    });
    vscode.window.registerTreeDataProvider("vsmacro", new (class {
        getTreeItem(element) {
            return element;
        }
        getChildren(element) {
            if (element) {
                return element.children.map((child) => {
                    return {
                        label: child.name,
                        command: {
                            command: child.command,
                            title: child.name,
                        },
                    };
                });
            }
            else {
                return exports.macroList.map((macro) => {
                    return {
                        label: macro.name,
                        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
                        children: macro.children,
                    };
                });
            }
        }
    })());
    // show html on the explorer
    vscode.window.registerWebviewViewProvider("vsmacrohtml", new (class {
        resolveWebviewView(webviewView, context, token) {
            webviewView.webview.options = {
                enableScripts: true,
            };
            webviewView.webview.html = `
        <html>
          <head>
            <style>
              body {
                color: #fff;
                font-family: sans-serif;
                font-size: 1rem;
              }
              .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
              }
              .title {
                font-size: 1rem;
                font-weight: bold;
              }
              .description {
                font-size: 0.8rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="title">Hello World</div>
              <div class="description">This is a sample webview</div>
              <button onclick="">Click Me</button>
          </body>
        </html>
        `;
        }
    })());
    context.subscriptions.push(start);
    context.subscriptions.push(...arr.flat());
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map