/* Utils */
const debug = require('debug')('Reservations table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  const Reservations = sequelize.define('reservation', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    primaryPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    optionalPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    replied: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Reservations.sync().then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Reservations;
};
