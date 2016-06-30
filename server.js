const express = require('express');
const bodyParser = require('body-parser');

const app = express();

/* CONFIGS */
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb'}));

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port')); // eslint-disable-line no-console
});
/* ------------------------------------------------------------------------------------------ */

/* Allow CORS */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
/* ------------------------------------------------------------------------------------------ */

// Website route
app.use('/', express.static(`${__dirname}/public`));

/* ROUTES */
require('./routes')(app);