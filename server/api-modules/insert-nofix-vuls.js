const db = require('../db-connecter.js');

const dbInstnace = db.getDbInstance();
const nofixVuls = dbInstnace.use('vulnerabilities_nofix');

const uploadNofixVuls2Db = (req, res) => {
  let noFixVuls = req.body.filter(vul => {
    return vul.sources.reduce((result, curr) => {
      return result = result || !curr.fixed_version
    }, false);
  });
  dbInstnace.destroy('vulnerabilities_nofix', (err, body) => {
    if (err && err.statusCode !== 404) {
      console.error(err);
      res.status(err.statusCode).json(err);
    } else {
      console.log('vulnerabilities_nofix table is removed');
      dbInstnace.create('vulnerabilities_nofix', (err, body) => {
        if (err) {
          console.error(err);
          res.status(err.statusCode).json(err);
        } else {
          console.log('vulnerabilities_nofix table is created');
          insertNoFixVuls(noFixVuls);
        }
      });
    }
  });
};

const insertNoFixVuls = (noFixVuls) => {
  nofixVuls.bulk({
    docs: noFixVuls,
  }, {include_docs: true}, (err, data) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Score base statistic date was created successfully!");
    }
  });
};

module.exports = {
  uploadNofixVuls2Db
}
