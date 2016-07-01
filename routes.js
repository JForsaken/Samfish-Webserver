module.exports = function(app) {
  const reservations = require('./app/controllers/reservations');
  const languages = require('./app/controllers/languages');
  const kids = require('./app/controllers/kids');
  const users = require('./app/controllers/users');

  app.get('/reservations', reservations.findAll);
  app.get('/languages', languages.findAll);
  app.get('/kids', kids.findAll);
  app.get('/users', users.findAll);

  app.post('/reservations', reservations.add);
  app.post('/languages', languages.add);
  app.post('/users', users.add);

  app.post('/login', users.login);
}
