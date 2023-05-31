const jwt = require('jsonwebtoken')
// Change to environment variable
const secret = 'mysecret'

const payload = {
    sub: '1234567890',
    name: 'John Doe',
    role: 'customer'
}

function signToken(payload, secret) {
    return jwt.sign(payload, secret)
}

const token = signToken(payload, secret)
console.log(token);