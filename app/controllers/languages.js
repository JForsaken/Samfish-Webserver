const db = require('../models');

/* Utils */
const queryHelper = require('./helpers/queries');

exports.findAll = (req, res) => {
  const query = queryHelper.getFormattedUrlQuery(req.query);
  db.Languages.findAll(query)
    .then(result => {
      if (!result.length) {
        res.status(404).send(`Could not find any language with the parameters '${JSON.stringify(query)}'`);
      }
      res.send(result);
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET languages: ${err}`);
    });
};

exports.add = (req, res) => {
  const newLanguage = req.body;

  db.Languages.build(newLanguage).save()
    .then(() => {
      res.send(`Successfully added the language: ${JSON.stringify(req.body)}`);
    })
    .catch(err => {
      res.status(400).send(`Could not add the language: ${err}`);
    });
};
