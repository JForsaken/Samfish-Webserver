const db = require('../models');

/* Utils */
const queryHelper = require('./helpers/queries');
const { omit } = require('lodash');

exports.findAll = (req, res) => {
  const query = queryHelper.getFormattedUrlQuery(req.query);
  db.Clients.findAll(query)
    .then(result => {
      if (!result.length) {
        res.status(404).send(`Could not find any clients with the parameters '${JSON.stringify(query)}'`);
      }

      res.send(result);
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET client: ${err}`);
    });
};

exports.add = (req, res) => {
  const newClient = req.body;

  db.Clients.build(newClient).save()
    .then(() => {
      res.send(`Successfully added the client: ${JSON.stringify(req.body)}`);
    })
    .catch(err => {
      res.status(400).send(`Could not add the client: ${err}`);
    });
};

exports.connect = (req, res) => {
  db.Clients.findAll({
    where: {
      courriel: {
        $ilike: req.body.email,
      },
    },
    raw: true,
  })
    .then(result => {
      if (!result.length || result[0].motdepasse !== req.body.password) {
        res.status(530).send();
      } else {
        res.status(200).send(omit(result[0], 'motdepasse'));
      }
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET client: ${err}`);
    });
};
