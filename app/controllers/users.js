const db = require('../models');

/* Utils */
const queryHelper = require('./helpers/queries');
const { cloneDeep } = require('lodash');

exports.findAll = (req, res) => {
  const query = queryHelper.getFormattedUrlQuery(req.query);
  db.Users.findAll(query)
    .then(result => {
      if (!result.length) {
        res.status(404).send(`Could not find any user with the parameters '${JSON.stringify(query)}'`);
      }
      res.send(result);
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET users: ${err}`);
    });
};

exports.add = (req, res) => {
  const newUser = cloneDeep(req.body);
  newUser.password = db.Users.generateHash(req.body.password);

  db.Users.build(newUser).save()
    .then(createdUser => {
      res.send(`Successfully added the user: ${JSON.stringify(createdUser)}`);
    })
    .catch(err => {
      res.status(400).send(`Could not add the user: ${err}`);
    });
};

exports.login = (req, res) => {
  const loginAttempt = cloneDeep(req.body);
  const query = {
    where: {
      username: loginAttempt.username,
    },
  };

  db.Users.findOne(query)
    .then(result => {
      if (!result) {
        res.status(404).send(`Could not find any user with the parameters '${JSON.stringify(query)}'`);
      }
      if (db.Users.validatePassword(loginAttempt.password, result.password)){
        const verifiedUser = {
          firstname: result.firstname,
          lastname: result.lastname,
          username: result.username,
        };

        res.status(200).send(`${JSON.stringify(verifiedUser)}`);
      } else {
        res.status(400).send(`Invalid  user login credentials for: ${JSON.stringify(loginAttempt)}`);
      }
    })
    .catch(err => {
      res.status(500).send(`Could not execute GET user: ${err}`);
    });
};
