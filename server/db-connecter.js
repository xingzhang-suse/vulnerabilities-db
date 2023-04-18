const nano = require('nano')('http://admin:Passw0rd@127.0.0.1:5984');

function getDbInstance() {
  return nano.db;
}

module.exports = {
  getDbInstance
};
