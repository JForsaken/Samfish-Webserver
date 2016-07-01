/* Utils */
const debug = require('debug')('Users table');
const bcrypt = require('bcrypt');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  const Users = sequelize.define('user', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      generateHash: password =>
        bcrypt.hashSync(password, 10),
      validatePassword: (attemptedPassword, actualPassword) =>
        bcrypt.compareSync(attemptedPassword, actualPassword),
    },
  });

  Users.sync().then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Users;
};
