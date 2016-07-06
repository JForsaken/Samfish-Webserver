module.exports = function(app) {
  const reservations = require('./app/controllers/reservations');
  const languages = require('./app/controllers/languages');
  const kids = require('./app/controllers/kids');
  const users = require('./app/controllers/users');

  const config = require('./app/controllers/config');
  const locales = require('./app/controllers/locales');

  app.get('/reservations', reservations.findAll);
  app.post('/reservations', reservations.add);
  app.put('/reservations/:id', reservations.update);
  app.delete('/reservations/:id', reservations.delete);

  app.get('/languages', languages.findAll);
  app.post('/languages', languages.add);

  app.get('/kids', kids.findAll);

  app.get('/config', config.getConfig);
  app.get('/locales/:language', locales.getLocale);
  app.post('/locales/:language', locales.updateLocale);

  app.get('/users', users.findAll);
  app.post('/users', users.add);

  app.post('/login', users.login);
}
