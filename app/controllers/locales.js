const db = require('../models');

/* Utils */
const fs = require('fs');
const { isEmpty } = require('lodash');

exports.getLocale = (req, res) => {
  const language = req.params.language.toUpperCase();

  const languageQuery = {
    where: {
      code: language,
    },
  };

  db.Languages.findOne(languageQuery)
    .then(foundLanguage => {
      if (!isEmpty(foundLanguage)) {
        res.status(200).send(JSON.parse(fs.readFileSync(`${__dirname}/../locales/${language}.json`, 'utf8')));
      } else {
        res.status(404).send(`Couldn't find the language with the code '${language}'`);
      }
    });
};

exports.updateLocale = (req, res) => {
  const language = req.params.language.toUpperCase();
  const updatedLocale = JSON.stringify(req.body);

  const languageQuery = {
    where: {
      code: language,
    },
  };

  db.Languages.findOne(languageQuery)
    .then(foundLanguage => {
      if (!isEmpty(foundLanguage)) {
        fs.writeFile(`${__dirname}/../locales/${language}.json`, updatedLocale, () => {
          res.status(200).send(`Sucessfully updated the '${language}' locale`);
        });
      } else {
        res.status(404).send(`Couldn't find the language with the code '${language}'`);
      }
    });
};
