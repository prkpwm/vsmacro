import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let start = vscode.commands.registerCommand("vsmacro.start", () => {
    vscode.window.showInformationMessage("Macro started!");
  });

  let disposable = vscode.commands.registerCommand(
    "vsmacro.pasteSelectAll",
    () => {
      vscode.window.activeTextEditor?.edit((editBuilder) => {
        const cursorPosition = vscode.window.activeTextEditor?.selection.active;
        if (cursorPosition) {
          editBuilder.insert(cursorPosition, "SELECT * FROM table");
        }
      });
    }
  );

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
      if (vscode.window.activeTextEditor?.document.getText(pos) === "SFT") {
        setTimeout(() => {
          vscode.commands.executeCommand("vsmacro.pasteSelectAll");
        }, 10);

        vscode.window.activeTextEditor?.edit((editBuilder) => {
          editBuilder.delete(pos);
        }); 
      }
    }
  });

  context.subscriptions.push(start);
  context.subscriptions.push(disposable);
}

export function deactivate() {}
