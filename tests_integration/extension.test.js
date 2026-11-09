const assert = require('assert');
const vscode = require('vscode');

async function run() {
  const extension = vscode.extensions.getExtension(
    'eventhorizon-oss.vscode-perf-gauge'
  );

  assert.ok(extension, 'extension should be available in the test host');
  await extension.activate();

  const commands = await vscode.commands.getCommands(true);
  assert.ok(
    commands.includes('vscode-perf-gauge.showGauge'),
    'Show Performance Gauge command should be registered'
  );
}

module.exports = { run };
