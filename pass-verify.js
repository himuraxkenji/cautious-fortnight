const bcrypt = require('bcrypt');

async function verifyPassword() {
    const password = '1234Segura!';
    const hash = '$2b$10$Z';
    const isMatch = await bcrypt.compare(password, hash);
    
}


