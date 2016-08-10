const Sequelize = require('sequelize');
const config = require('../config/config.js');

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
  salt: Sequelize.STRING(100),
  points: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  games: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

User.sync();

module.exports.User = User;
module.exports.sequelize = sequelize;