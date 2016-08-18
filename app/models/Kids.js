/* Utils */
const debug = require('debug')('Kids table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  const Kids = sequelize.define('kid', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reservationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Kids.sync().then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Kids;
};
