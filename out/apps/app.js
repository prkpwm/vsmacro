"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onDidChangeTextEditorSelection = void 0;
const vscode = require("vscode");
const sql_1 = require("./commands/sql");
const common_1 = require("./commands/common");
const macroList = [...common_1.COMMON, ...sql_1.SQL];
function onDidChangeTextEditorSelection() {
    vscode.window.onDidChangeTextEditorSelection((event) => {
        const cursorPosition = vscode.window.activeTextEditor?.selection.active;
        if (cursorPosition) {
            const pos = new vscode.Range(new vscode.Position(cursorPosition?.line || 0, cursorPosition.character - 4), cursorPosition);
            for (let i = 0; i < macroList.length; i++) {
                if (vscode.window.activeTextEditor?.document.getText(pos) ===
                    macroList[i].key) {
                    setTimeout(() => {
                        vscode.window.activeTextEditor?.edit((editBuilder) => {
                            const cursorPosition = vscode.window.activeTextEditor?.selection.active;
                            if (cursorPosition) {
                                editBuilder.insert(cursorPosition, macroList[i].description);
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
    let arr = macroList.map((macro) => {
        return vscode.commands.registerCommand(macro.command, () => {
            vscode.window.activeTextEditor?.edit((editBuilder) => {
                const cursorPosition = vscode.window.activeTextEditor?.selection.active;
                if (cursorPosition) {
                    editBuilder.insert(cursorPosition, macro.description);
                }
            });
        });
    });
    context.subscriptions.push(...arr);
}
exports.onDidChangeTextEditorSelection = onDidChangeTextEditorSelection;
//# sourceMappingURL=app.js.map