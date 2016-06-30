module.exports = function(app) {
  const reservations = require('./app/controllers/reservations');

  app.get('/reservations', reservations.findAll);
}
