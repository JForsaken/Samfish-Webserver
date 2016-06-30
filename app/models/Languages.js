/* Utils */
const debug = require('debug')('Languages table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  // create clients model
  const Languages = sequelize.define('language', {
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });

  Languages.sync().then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Languages;
};
