const db = require('../db-connecter.js');

const dbInstnace = db.getDbInstance();
const scoreBaseStatisticInfo = dbInstnace.use('vulnerabilities_score_base_statistic');

const uploadGroupedVulsByScore = (req, res) => {
  let scoreBaseMap = new Array(10);
  scoreBaseMap.fill(new Array());
  scoreBaseMap = scoreBaseMap.map(elem => {
    return new Array();
  });
  req.body.forEach(vul => {
    let index = Math.round(vul.score);
    scoreBaseMap[index].push(
      {
        name: vul.name,
        score: vul.score,
        severity: vul.severity,
    		vectors: vul.vectors,
    		description: vul.description,
    		score_v3: vul.score_v3,
    		vector_v3: vul.vector_v3,
      }
    )
  });
  dbInstnace.destroy('vulnerabilities_score_base_statistic', (err, body) => {
    if (err && err.statusCode !== 404) {
      console.error(err);
      res.status(err.statusCode).json(err);
    } else {
      console.log('vulnerabilities_score_base_statistic table is removed');
      dbInstnace.create('vulnerabilities_score_base_statistic', (err, body) => {
        if (err) {
          console.error(err);
          res.status(err.statusCode).json(err);
        } else {
          console.log('vulnerabilities_score_base_statistic table is created');
          insertScoreBaseStatisticData(scoreBaseMap);
        }
      });
    }
  });
};

const insertScoreBaseStatisticData = (scoreBaseMap) => {
  scoreBaseStatisticInfo.bulk({
    docs: [{scoreBaseMap: scoreBaseMap}],
  }, {include_docs: true}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Score base statistic data was created successfully!");
    }
  });
};

module.exports = {
  uploadGroupedVulsByScore
}
