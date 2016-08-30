module.exports = function(app) {
  const reservations = require('./app/controllers/reservations');
  const kids = require('./app/controllers/kids');
  const users = require('./app/controllers/users');

  app.get('/reservations', reservations.findAll);
  app.post('/reservations', reservations.add);
  app.put('/reservations/:id', reservations.reply);
  app.put('/reservations/hide/:id', reservations.hide);
  app.delete('/reservations/:id', reservations.delete);


  app.get('/kids', kids.findAll);


  app.get('/users', users.findAll);
  app.post('/users', users.add);

  app.post('/login', users.login);
}
