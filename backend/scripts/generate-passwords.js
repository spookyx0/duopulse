const bcrypt = require('bcrypt');

async function generateHashedPasswords() {
  const password = 'password123';
  const saltRounds = 10;
  
  const quinnreeveHash = await bcrypt.hash(password, saltRounds);
  const aliyahHash = await bcrypt.hash(password, saltRounds);
  
  console.log('Quinnreeve password hash:', quinnreeveHash);
  console.log('Aliyah password hash:', aliyahHash);
}

generateHashedPasswords();