/* Utils */
const debug = require('debug')('Kids table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  // create clients model
  const Kids = sequelize.define('kid', {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reservationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });

  Kids.sync().then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Kids;
};
