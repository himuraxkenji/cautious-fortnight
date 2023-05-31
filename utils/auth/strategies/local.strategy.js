const { Strategy } = require('passport-local');
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const AuthService = require('../../../services/auth.service');
const service = new AuthService();

const LocalStrategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (username, password, done) => {
    try {
      const user = await service.findByEmail(username);
      if (!user) {
        return done(boom.unauthorized(), false);
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        delete user.password;
        return done(boom.unauthorized(), false);
      }

      delete user.dataValues.password;
      return done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

module.exports = LocalStrategy;
