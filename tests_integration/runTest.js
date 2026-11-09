const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
  try {
    await runTests({
      extensionDevelopmentPath: path.resolve(__dirname, '..'),
      extensionTestsPath: path.resolve(__dirname, 'extension.test.js')
    });
  } catch (error) {
    console.error('Failed to run extension tests.');
    console.error(error);
    process.exitCode = 1;
  }
}

void main();
