const boom = require('@hapi/boom');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === '1234') {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkAdminRole(req, res, next) {
  const { role } = req.user;
  if (role === 'admin') {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkRoles(...roles) {
  return (req, res, next) => {
    const { role } = req.user;
    if (roles.includes(role)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
}

module.exports = {
  checkApiKey,
  checkAdminRole,
  checkRoles,
};
