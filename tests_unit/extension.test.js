const assert = require('node:assert/strict');
const { test } = require('node:test');
const manifest = require('../package.json');

test('the Show Performance Gauge command is contributed and activates the extension', () => {
  const command = 'vscode-perf-gauge.showGauge';
  const contributedCommands = manifest.contributes.commands.map(
    (contribution) => contribution.command
  );

  assert.ok(contributedCommands.includes(command));
  assert.ok(manifest.activationEvents.includes(`onCommand:${command}`));
});
