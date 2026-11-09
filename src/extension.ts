import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext): void {
  const command = vscode.commands.registerCommand(
    'vscode-perf-gauge.showGauge',
    () => {
      void vscode.window.showInformationMessage(
        'The Performance Gauge extension is ready.'
      );
    }
  );

  context.subscriptions.push(command);
}
