const _ = require('underscore');

module.exports = (error, res, next) => {
  if (error.message.includes('references a non existing ID')) {
    const errors = {};
    _.each(error.errors, (val, key) => {
      Object.assign(errors, {
        [key]: {
          message: val.message,
          path: val.path,
          type: 'nonExistingId',
        },
      });
    });

    Object.assign(error, { errors });
    return next(error);
  }

  return next();
};
