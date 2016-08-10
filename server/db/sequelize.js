const Sequelize = require('sequelize');
const config = require('../config/config.js');
const bcrypt = require('bcrypt-nodejs');

// setup connection with postgresdb
const sequelize = new Sequelize(config.herokuPostgresAuth, {
  dialect: 'postgres',
  protocol: 'postgres',
  port: 5432,
  host: 'ec2-54-235-125-135.compute-1.amazonaws.com',
  dialectOptions: {
    ssl: true,
  },
  logging: false,
  define: {
    timestamps: false
  }
});

// user model
const User = sequelize.define('user', {
  name: Sequelize.STRING(100),
  password: Sequelize.STRING(100),
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  games: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

User.isValidPassword(password, id) {
  // passed in a password and a userId
  // look up the password attached to the userId
  return this.find({id: id})
    .then((user) => {
  // compare the passwords together
  // return whether the passwords match
      return bcrypt.compareSync(password, user[0].password);
    })
    .catch((err) => console.log(err));
}

User.generateHash(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(16));
}

User.sync();

module.exports.User = User;
module.exports.sequelize = sequelize;