const UserService = require('./user.service');
const service = new UserService();
const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config');
const nodeMailer = require('nodemailer');

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized('Email or password invalid');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized('Email or password invalid');
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.AUTH_JWT_SECRET, {
      expiresIn: '15m',
    });
    return {
      user,
      token,
    };
  }

  async sendMail(infoMail) {
    
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPassword,
      },
    });

    await transporter.sendMail(infoMail);
    return { message: 'Email enviado'};
  }

  async sentRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized('Email or password invalid');
    }
    const payload = {sub: user.id, role: user.role};
    const token = jwt.sign(payload, config.AUTH_JWT_SECRET, {expiresIn: '15m'});
    const link = `http://myfrontend/recovery?token=${token}`
    await service.update(user.id, {recoveryToken: token})
    const mail = {
        from: 'empresa@gmail.com',
        to: `${user.email}`,
        subject: 'Recuperación de contraseña',
        html: `<h1>Ingresa a este link => ${link}</h1>`,
    }
    const rta = await this.sendMail(mail);
    return rta;
  }

  async changePassword(token, password) {
    try {
        const payload = jwt.verify(token, config.AUTH_JWT_SECRET);
        const user = await service.findOne(payload.sub);
        if(user.recoveryToken !== token) {
            throw boom.unauthorized('Invalid token');
        }
        const hash = await bcrypt.hash(password, 10);
        await service.update(user.id, {password: hash, recoveryToken: null});
        return {message: 'Contraseña actualizada'};
    } catch (error) {
        throw boom.unauthorized('Email or password invalid');
    }
  }
}

module.exports = AuthService;
