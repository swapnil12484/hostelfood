const bcrypt = require('bcrypt');
async function test() {
  const h = await bcrypt.hash('test', 10);
  console.log('Hash:', h);
}
test();
