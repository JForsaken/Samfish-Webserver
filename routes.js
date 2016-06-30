module.exports = function(app) {
  const clients = require('./app/controllers/clients');

  app.get('/clients', clients.findAll);
}
