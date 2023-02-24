"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = exports.macroList = void 0;
const vscode = require("vscode");
exports.macroList = [
    {
        name: "select",
        key: "sel!",
        description: "SELECT * FROM ",
        command: "vsmacro.select",
    },
    {
        name: "insert",
        key: "ins!",
        description: "INSERT INTO ",
        command: "vsmacro.insert",
    },
    {
        name: "update",
        key: "upd!",
        description: "UPDATE ",
        command: "vsmacro.update",
    },
    {
        name: "delete",
        key: "del!",
        description: "DELETE FROM ",
        command: "vsmacro.delete",
    },
    {
        name: "console.log",
        key: "clg!",
        description: "console.log( )",
        command: "vsmacro.console.log",
    },
];
function activate(context) {
    let start = vscode.commands.registerCommand("vsmacro.start", () => {
        vscode.window.showInformationMessage("Macro started!");
    });
    vscode.window.onDidChangeTextEditorSelection((event) => {
        const cursorPosition = vscode.window.activeTextEditor?.selection.active;
        if (cursorPosition) {
            const pos = new vscode.Range(new vscode.Position(cursorPosition?.line || 0, cursorPosition.character - 4), cursorPosition);
            for (let i = 0; i < exports.macroList.length; i++) {
                if (vscode.window.activeTextEditor?.document.getText(pos) ===
                    exports.macroList[i].key) {
                    setTimeout(() => {
                        vscode.window.activeTextEditor?.edit((editBuilder) => {
                            const cursorPosition = vscode.window.activeTextEditor?.selection.active;
                            if (cursorPosition) {
                                editBuilder.insert(cursorPosition, exports.macroList[i].description);
                            }
                        });
                    }, 50);
                    vscode.window.activeTextEditor?.edit((editBuilder) => {
                        editBuilder.delete(pos);
                    });
                }
            }
        }
    });
    let arr = exports.macroList.map((macro) => {
        return vscode.commands.registerCommand(macro.command, () => {
            vscode.window.activeTextEditor?.edit((editBuilder) => {
                const cursorPosition = vscode.window.activeTextEditor?.selection.active;
                if (cursorPosition) {
                    editBuilder.insert(cursorPosition, macro.description);
                }
            });
        });
    });
    vscode.window.registerTreeDataProvider("vsmacro", new (class {
        getTreeItem(element) {
            return element;
        }
        getChildren(element) {
            return exports.macroList.map((macro) => {
                return {
                    label: macro.name,
                    description: macro.description,
                    command: {
                        command: macro.command,
                        title: macro.name,
                    },
                };
            });
        }
    })());
    context.subscriptions.push(start);
    context.subscriptions.push(...arr);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map