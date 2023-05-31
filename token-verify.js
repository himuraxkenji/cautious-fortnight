const jwt = require('jsonwebtoken')
const secret = 'mysecret'
const token = 'askdjaksldjaskldjlasd.asdasd.asdasd'

function verifyToken(token, secret) {
    return jwt.verify(token, secret)
}

const decoded = verifyToken(token, secret)
console.log(decoded);