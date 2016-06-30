/* Utils */
const debug = require('debug')('Clients table');

module.exports = function (sequelize, DataTypes) { // eslint-disable-line func-names
  // create clients model
  const Clients = sequelize.define('client', {
    idclient: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    courriel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    numerocivique: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    rue: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    ville: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    province: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    codepostal: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    datenaissance: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    motdepasse: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    debutforfait: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    finforfait: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    idforfait: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    idcarte: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });

  Clients.sync({ force: false }).then(() => {
    debug('synced');
  }).catch(() => {
    debug('failed sync');
  });

  return Clients;
};
