import * as vscode from "vscode";

export const macroList = [
  {
    name: "select",
    key: "sft",
    description: "SELECT * FROM ",
  },
  {
    name: "insert",
    key: "ift",
    description: "INSERT INTO ",
  },
  {
    name: "update",
    key: "uft",
    description: "UPDATE ",
  },
  {
    name: "delete",
    key: "dft",
    description: "DELETE FROM ",
  },
  {
    name: "console.log",
    key: "clt",
    description: "console.log(",
  },
];

export function activate(context: vscode.ExtensionContext) {
  let start = vscode.commands.registerCommand("vsmacro.start", () => {
    vscode.window.showInformationMessage("Macro started!");
  });

  let disposable = vscode.commands.registerCommand("vsmacro.detect", () => {
    vscode.window.activeTextEditor?.edit((editBuilder) => {
      const cursorPosition = vscode.window.activeTextEditor?.selection.active;
      if (cursorPosition) {
        editBuilder.insert(cursorPosition, "SELECT * FROM table");
      }
    });
  });

  vscode.window.onDidChangeTextEditorSelection((event) => {
    const cursorPosition = vscode.window.activeTextEditor?.selection.active;
    if (cursorPosition) {
      const pos = new vscode.Range(
        new vscode.Position(
          cursorPosition?.line || 0,
          cursorPosition.character - 3
        ),
        cursorPosition!
      );
      if (vscode.window.activeTextEditor?.document.getText(pos) === "sft") {
        setTimeout(() => {
          vscode.commands.executeCommand("vsmacro.detect");
        }, 50);

        vscode.window.activeTextEditor?.edit((editBuilder) => {
          editBuilder.delete(pos);
        });
      }
    }
  });

  // show macro list in explorer
  vscode.window.registerTreeDataProvider(
    "vsmacro",
    new (class implements vscode.TreeDataProvider<vscode.TreeItem> {
      getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
        return element;
      }

      getChildren(element?: vscode.TreeItem): vscode.TreeItem[] {
        return macroList.map((macro) => {
          return {
            label: macro.name,
            description: macro.description,
            command: {
              command: "vsmacro.detect",
              title: "Detect",
            },
          };
        });
      }
    })()
  );

  context.subscriptions.push(start);
  context.subscriptions.push(disposable);
}

export function deactivate() {}
