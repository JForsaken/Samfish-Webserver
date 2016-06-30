/* Utils */
const debug = require('debug')('Languages table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  // create clients model
  const Languages = sequelize.define('reservation', {
    languageId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });

  Languages.sync({ force: true }).then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Languages;
};
