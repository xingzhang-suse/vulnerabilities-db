const db = require('../db-connecter.js');

const dbInstnace = db.getDbInstance();
const dateBaseStatisticInfo = dbInstnace.use('vulnerabilities_date_base_statistic');

const getGroupedVulsByPublishedDate = () => {
  return dateBaseStatisticInfo.list({include_docs: true});
};


module.exports = {
  getGroupedVulsByPublishedDate
}
