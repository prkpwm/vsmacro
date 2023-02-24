"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTreeDataProvider = void 0;
const vscode = require("vscode");
function registerTreeDataProvider() {
    vscode.window.registerTreeDataProvider("vsmacro", new (class {
        getTreeItem(element) {
            return element;
        }
        getChildren(element) {
            return macroList.map((macro) => {
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
}
exports.registerTreeDataProvider = registerTreeDataProvider;
//# sourceMappingURL=treeview.js.map