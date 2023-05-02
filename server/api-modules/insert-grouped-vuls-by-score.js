const db = require('../db-connecter.js');

const dbInstnace = db.getDbInstance();
const scoreBaseStatisticInfo = dbInstnace.use('vulnerabilities_score_base_statistic');

const uploadGroupedVulsByScore = (req, res) => {
  let scoreBaseMap = new Array(11);
  scoreBaseMap.fill(new Array());
  scoreBaseMap = scoreBaseMap.map(elem => {
    return new Array();
  });
  req.body.Vulnerabilities.forEach(vul => {
    let index = vul.Score ? Math.ceil(vul.Score) : 0;
    scoreBaseMap[index].push(
      {
        Name: vul.Name,
        Score: vul.Score,
        Severity: vul.Severity,
    		Vectors: vul.Vectors,
    		ScoreV3: vul.ScoreV3,
    		VectorsV3: vul.VectorsV3,
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
