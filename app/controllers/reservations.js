const db = require('../models');
const debug = require('debug')('reservations controller');
/* Utils */
const queryHelper = require('./helpers/queries');
const { cloneDeep, forEach, isEmpty } = require('lodash');

exports.findAll = (req, res) => {
  const query = queryHelper.getFormattedUrlQuery(req.query);
  debug(query);
  db.Reservations.findAll(query)
    .then(result => {
      if (!result.length) {
        res.status(404).send(`Could not find any reservation with the parameters '${JSON.stringify(query)}'`);
      }
      res.send(result);
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET reservation: ${err}`);
    });
};

exports.add = (req, res) => {
  const newReservation = cloneDeep(req.body);
  const kids = req.body.kids;

 delete newReservation.kids;

  if (!isEmpty(kids)) {
    db.Reservations.build(newReservation).save()
      .then(savedReservation => {
        forEach(kids, kid => {
          const currentKid = cloneDeep(kid);
          currentKid.reservationId = savedReservation.id;
          db.Kids.build(currentKid).save();
        });

        res.send(`Successfully added the language: ${JSON.stringify(req.body)}`);
      })
      .catch(err => {
        res.status(400).send(`Could not add the language: ${err}`);
      });
  }
};
