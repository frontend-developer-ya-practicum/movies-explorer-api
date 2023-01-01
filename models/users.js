const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: isEmail,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userScheme.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password,
) {
  const errorMessage = 'The email address or password is incorrect';

  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errorMessage));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error(errorMessage));
        }

        return user;
      });
    });
};

module.exports = mongoose.model('user', userScheme);
