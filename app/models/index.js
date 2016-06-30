/* Database */
const { CONNECTION_STRING } = require('../constants/database');
const DataTypes = require('sequelize');
const sequelize = new DataTypes(CONNECTION_STRING);

/* Utils */
const { forOwn } = require('lodash');

// Database context
const db = {};

/* Models */
db.MODELS = {
  RESERVATIONS: 'Reservations',
  KIDS: 'Kids',
  LANGUAGES: 'Languages',
};

// Import every models
forOwn(db.MODELS, value => {
  db[value] = sequelize.import(`./${value}.js`);
});

// Add sequelize to db var
db.DataTypes = DataTypes;
db.sequelize = sequelize;

// -- Associations --
db.Reservations.hasMany(db.Kids);
db.Kids.belongsTo(db.Languages);
db.Reservations.belongsTo(db.Languages);

module.exports = db;
