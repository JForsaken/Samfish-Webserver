/* Utils */
const debug = require('debug')('Languages table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  const Languages = sequelize.define('language', {
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });

  Languages.sync().then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Languages;
};
