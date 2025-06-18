// backend/generate-hash.js
const bcrypt = require('bcrypt');

async function generateHash() {
  const password = '123456'; // La contraseña que queremos usar
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
}

generateHash();
