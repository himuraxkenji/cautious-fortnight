const {Strategy, ExtractJwt} = require('passport-jwt');
const {config} = require('../../../config');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
}

const JwtStrategy = new Strategy(options, async (payload, done) => {
    try {
        done(null, payload);
    } catch (error) {
        done(error);
    }
})

module.exports = JwtStrategy;