/* Database */
const { CONNECTION_STRING } = require('../constants/database');
const DataTypes = require('sequelize');
const sequelize = new DataTypes(CONNECTION_STRING);

/* Utils */
const { forOwn } =require('lodash');

// Database context
const db = {};

/* Models */
db.MODELS = {
  RESERVATIONS: 'Reservations',
  KIDS: 'Kids',
  LANGUAGES: 'Languages',
};

// Import every models
forOwn(db.MODELS, (value, key) => {
  db[value] = sequelize.import(`./${value}.js`);
});

// Add sequelize to db var
db.DataTypes = DataTypes;
db.sequelize = sequelize;

// -- Associations --
db.Reservations.hasMany(db.Kids, { foreignKey: 'reservationId' });
db.Reservations.hasOne(db.Languages, { foreignKey: 'languageId' });
db.Kids.hasOne(db.Languages, { foreignKey: 'languageId' });

module.exports = db;
