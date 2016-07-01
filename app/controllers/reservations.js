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

exports.update = (req, res) => {
  const updateAttributes = req.body;
  const { id } = req.params;
  const { username } = req.body;

  delete updateAttributes.username;

  db.Reservations.findById(id)
    .then(result => {
      if (!result) {
        res.status(404).send(`Could not find any reservation with the id #${id}`);
      }

      const userQuery = {
        where: {
          username,
        },
      };

      db.Users.findOne(userQuery)
        .then(user => {
          if (user.admin) {
            result.updateAttributes(updateAttributes)
              .then(() => {
                res.status(200).send(`Successfully updated the reservation with the id #${id}`);
              })
              .catch(err => {
                res.status(500).send(`Could not execute PUT reservation by id query: ${err}`);
              });
          } else {
            res.status(400).send(`User '${username}' doesn't have the required privileges`);
          }
        })
        .catch(() => {
          res.status(404).send(`Could not find user with username '${username}'`);
        });
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET reservation by id query: ${err}`);
    });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  db.Reservations.findById(id)
    .then(result => {
      if (!result) {
        res.status(404).send(`Could not find any reservation with the id #${id}`);
      }

      const userQuery = {
        where: {
          username,
        },
      };

      db.Users.findOne(userQuery)
        .then(user => {
          if (user.admin) {
            result.destroy();
            res.status(200).send(`Successfully deleted the reservation with the id #${id}`);
          } else {
            res.status(400).send(`User '${username}' doesn't have the required privileges`);
          }
        })
        .catch(() => {
          res.status(404).send(`Could not find user with username '${username}'`);
        });
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET reservation by id query: ${err}`);
    });
};
