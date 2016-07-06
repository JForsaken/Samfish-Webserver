/* Constants */
const { CONFIG } = require('../constants/config');

exports.getConfig = (req, res) => {
  res.send(CONFIG);
};

