const bcrypt = require('bcrypt');

async function hashPassword() {
    const password = '1234Segura!';
    const hash = await bcrypt.hashSync(password, 10);
}


