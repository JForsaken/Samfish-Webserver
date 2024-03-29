const db = require('../models');
const debug = require('debug')('Sparkpost');

/* Utils */
const queryHelper = require('./helpers/queries');
const SparkPost = require('sparkpost');

const sparky = new SparkPost(); // uses process.env.SPARKPOST_API_KEY
const fs = require('fs');
const { cloneDeep, forEach, isEmpty, omit } = require('lodash');

const sendEmail = (reservation, kids) => {
  const currentLocale = JSON.parse(
    fs.readFileSync(`${__dirname}/../locales/${reservation.language}.json`, 'utf8')
  );

  let htmlBody = `<html><body><h2>${currentLocale.messages.email.header}</h2><br /><h3>${currentLocale.messages.email.reservationInfo}</h3><ul>`;

  // reservation info
  const formattedReservation = omit(reservation, ['language', 'emailAddress']);
  forEach(formattedReservation, (value, key) => {
    if (value) {
      htmlBody += `<li>${currentLocale.messages.email[key]}: ${value}</li>`;
    }
  });

  // kids info
  htmlBody += `</ul><br /><h3>${currentLocale.messages.email.kids.header}</h3><ol>`;
  forEach(kids, kid => {
    htmlBody += `<li>${kid.firstname} ${kid.lastname} (${kid.birthday}) (${kid.sex})</li>`;
  });
  htmlBody += '</ol></body></html>';

  const mail = {
    from: 'info@annees-lumiere.com',
    to: reservation.emailAddress,
    subject: `${currentLocale.messages.email.subject}, ${formattedReservation.firstname}!`,
    html: htmlBody,
  };

  sparky.transmissions.send({
    transmissionBody: {
      content: {
        from: mail.from,
        subject: mail.subject,
        html: htmlBody,
      },
      recipients: [{ address: mail.to }],
    },
  }, (err) => {
    if (err) {
      debug(`Whoops! Something went wrong: ${err}`);
    } else {
      debug(`Email sent to: ${mail.to}!`);
    }
  });
};

exports.findAll = (req, res) => {
  const query = queryHelper.getFormattedUrlQuery(req.query);
  db.Reservations.findAll(query)
    .then(result => {
      if (!result.length) {
        res.status(400).send(`Could not find any reservation with the parameters '${JSON.stringify(query)}'`);
      }
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET reservation: ${err}`);
    });
};

exports.add = (req, res) => {
  const newReservation = cloneDeep(req.body);
  const kids = req.body.kids;
  let errors = false;
  delete newReservation.kids;

  if (!isEmpty(kids)) {
    db.Reservations.build(newReservation).save()
      .then(savedReservation => {
        forEach(kids, kid => {
          const currentKid = cloneDeep(kid);
          currentKid.reservationId = savedReservation.id;
          db.Kids.build(currentKid).save()
            .catch(err => {
              errors = true;
              savedReservation.destroy();
              res.status(400).send(`Could not create kid: ${err}`);
            });
        });
        if (!errors) {
          sendEmail(newReservation, kids);
          res.status(200).send(req.body);
        }
      })
      .catch(err => {
        res.status(400).send(`Could not add the reservation: ${err}`);
      });
  }
};

exports.reply = (req, res) => {
  const updateAttributes = req.body;
  const { id } = req.params;
  const { username } = req.body;

  delete updateAttributes.username;

  db.Reservations.findById(id)
    .then(result => {
      if (!result) {
        res.status(400).send(`Could not find any reservation with the id #${id}`);
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
          res.status(400).send(`Could not find user with username '${username}'`);
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
        res.status(400).send(`Could not find any reservation with the id #${id}`);
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
          res.status(400).send(`Could not find user with username '${username}'`);
        });
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET reservation by id query: ${err}`);
    });
};

exports.hide = (req, res) => {
  const updateAttributes = req.body;
  const { id } = req.params;
  const { username } = req.body;

  delete updateAttributes.username;

  db.Reservations.findById(id)
    .then(result => {
      if (!result) {
        res.status(400).send(`Could not find any reservation with the id #${id}`);
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
                res.status(200).send(`Successfully hidden the reservation with the id #${id}`);
              })
              .catch(err => {
                res.status(500).send(`Could not execute PUT reservation by id query: ${err}`);
              });
          } else {
            res.status(400).send(`User '${username}' doesn't have the required privileges`);
          }
        })
        .catch(() => {
          res.status(400).send(`Could not find user with username '${username}'`);
        });
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET reservation by id query: ${err}`);
    });
};
