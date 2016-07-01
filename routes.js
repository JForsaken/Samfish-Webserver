module.exports = function(app) {
  const reservations = require('./app/controllers/reservations');
  const languages = require('./app/controllers/languages');
  const kids = require('./app/controllers/kids');
  const users = require('./app/controllers/users');

  app.get('/reservations', reservations.findAll);
  app.post('/reservations', reservations.add);
  app.put('/reservations/:id', reservations.update);
  app.delete('/reservations/:id', reservations.delete);

  app.get('/languages', languages.findAll);
  app.post('/languages', languages.add);

  app.get('/kids', kids.findAll);

  app.get('/users', users.findAll);
  app.post('/users', users.add);

  app.post('/login', users.login);
}
