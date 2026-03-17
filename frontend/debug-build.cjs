const vite = require('vite');
const path = require('path');

async function build() {
  try {
    await vite.build({
      root: path.resolve(__dirname),
    });
  } catch (err) {
    console.error('--- VITE BUILD ERROR ---');
    console.error('Message:', err.message);
    if (err.errors) {
      console.error('Sub-errors:', JSON.stringify(err.errors, null, 2));
    }
    console.error('Stack:', err.stack);
    process.exit(1);
  }
}

build();
