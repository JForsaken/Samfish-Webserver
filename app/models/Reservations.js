/* Utils */
const debug = require('debug')('Reservations table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  // create clients model
  const Reservations = sequelize.define('reservation', {
    reservationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });

  Reservations.sync({ force: true }).then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Reservations;
};
