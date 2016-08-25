const db = require('../models');

/* Utils */
const queryHelper = require('./helpers/queries');

exports.findAll = (req, res) => {
  const query = queryHelper.getFormattedUrlQuery(req.query);
  db.Kids.findAll(query)
    .then(result => {
      if (!result.length) {
        res.status(400).send(`Could not find any kid with the parameters '${JSON.stringify(query)}'`);
      }
      res.send(result);
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET kids: ${err}`);
    });
};
