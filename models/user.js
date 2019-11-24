const moongose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = moongose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  }
});

userSchema.pre('save', function(next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      })
    })
  } else {
    next();
  }
});

userSchema.methods.comparePasswords = function(candidatePassword, checkPassword) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return checkPassword(err);
    checkPassword(null, isMatch);
  });
};

const User = moongose.model('User', userSchema);

module.exports = { User }
