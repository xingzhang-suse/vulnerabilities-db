const db = require('../db-connecter.js');
const moment = require('moment');
const utils = require('../utils/common-utils.js');

const dbInstnace = db.getDbInstance();
const dateBaseStatisticInfo = dbInstnace.use('vulnerabilities_date_base_statistic');

const uploadGroupedVulsByLastModifiedDate = (req, res) => {
  const compareYM = (ym1, ym2) => {
    if (ym1 > ym2) return 1;
    else if (ym1 < ym2) return -1;
    else return 0;
  };
  let vuls = req.body.Vulnerabilities.map(vul => {
    let _vul = JSON.parse(JSON.stringify(vul));
    let mostRecentLastModifiedYM = '000101';
    if (vul.Entries) {
      mostRecentLastModifiedYM = vul.Entries
      .map(entry => {
        entry.LastModifiedYM = `${entry.LastModifiedDate.substring(0, 4).toString()}${entry.LastModifiedDate.substring(5, 7).toString()}`;
        return entry;
      })
      .reduce((accu, curr) => {
        return compareYM(accu, curr.LastModifiedYM) === 1 ? accu : curr.LastModifiedYM;
      }, '197001');
    }

    _vul.LastModifiedYM = mostRecentLastModifiedYM;
    delete _vul.Entries;
    return _vul;
  });
  let mostRecentLastModifiedYM = utils.groupBy(vuls, 'LastModifiedYM');
  mostRecentLastModifiedYM = Object.entries(mostRecentLastModifiedYM).map(([k, v]) => {
    return {
      LastModifiedYM: k,
      vuls: v
    }
  }).sort((a, b) => b.LastModifiedYM - a.LastModifiedYM ).slice(0, 10);
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
          insertDateBaseStatisticData(mostRecentLastModifiedYM);
        }
      });
    }
  });
};

const insertDateBaseStatisticData = (mostRecentLastModifiedYM) => {
  dateBaseStatisticInfo.bulk({
    docs: [{groupedVulsByYearMonth: mostRecentLastModifiedYM}],
  }, {include_docs: true}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Date base statistic data was created successfully!");
    }
  });
};

module.exports = {
  uploadGroupedVulsByLastModifiedDate
}
