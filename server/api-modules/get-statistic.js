const getVulsByScore = require('./get-grouped-vuls-by-score.js');
const getVulsByDate = require('./get-grouped-vuls-by-date.js');

const getStatisticData = (req, res) => {
  let vulsByScore$ = getVulsByScore.getGroupedVulsByScore();
  let vulsByDate$ = getVulsByDate.getGroupedVulsByPublishedDate();
  Promise.all([vulsByScore$, vulsByDate$])
    .then(result => {
      let vulsByScore = result[0].rows[0].doc.scoreBaseMap;
      let vulsByDate = result[1].rows[0].doc.groupedVulsByYearMonth;
      res.status(200).json({
        vulsByScore,
        vulsByDate
      });
    })
    .catch(err => {
      console.error(err);
      res.status(err.statusCode).json(err);
    });
};

module.exports = {
  getStatisticData
}
