const db = require('../db-connecter.js');
const moment = require('moment');
const utils = require('../utils/common-utils.js');

const dbInstnace = db.getDbInstance();
const dateBaseStatisticInfo = dbInstnace.use('vulnerabilities_date_base_statistic');

const uploadGroupedVulsByPublishedDate = (req, res) => {
  let vuls = req.body.map(vul => {
    let _vul = JSON.parse(JSON.stringify(vul));
    let mostRecentPublishedTimestamp = vul.sources.reduce((accu, curr) => {
      return  Math.max(accu, curr.published_timestamp);
    }, 0);
    _vul.publishedYM = moment(mostRecentPublishedTimestamp * 1000).format('YYYYMM');
    delete _vul.sources;
    return _vul;
  });
  let groupedVulsByYearMonth = utils.groupBy(vuls, 'publishedYM');
  groupedVulsByYearMonth = Object.entries(groupedVulsByYearMonth).map(([k, v]) => {
    return {
      yearMonth: k,
      vuls: v
    }
  }).sort((a, b) => b.yearMonth - a.yearMonth).slice(0, 10);
  dbInstnace.destroy('vulnerabilities_date_base_statistic', (err, body) => {
    if (err && err.statusCode !== 404) {
      console.error(err);
      res.status(err.statusCode).json(err);
    } else {
      console.log('vulnerabilities_date_base_statistic table is removed');
      dbInstnace.create('vulnerabilities_date_base_statistic', (err, body) => {
        if (err) {
          console.error(err);
          res.status(err.statusCode).json(err);
        } else {
          console.log('vulnerabilities_date_base_statistic table is created');
          insertDateBaseStatisticData(groupedVulsByYearMonth);
        }
      });
    }
  });
};

const insertDateBaseStatisticData = (groupedVulsByYearMonth) => {
  dateBaseStatisticInfo.bulk({
    docs: [{groupedVulsByYearMonth: groupedVulsByYearMonth}],
  }, {include_docs: true}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Date base statistic data was created successfully!");
    }
  });
};

module.exports = {
  uploadGroupedVulsByPublishedDate
}
