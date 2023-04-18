const db = require('../db-connecter.js');

const dbInstnace = db.getDbInstance();
const scoreBaseStatisticInfo = dbInstnace.use('vulnerabilities_score_base_statistic');

const getGroupedVulsByScore = () => {
  return scoreBaseStatisticInfo.list({include_docs: true});
};

module.exports = {
  getGroupedVulsByScore
}
