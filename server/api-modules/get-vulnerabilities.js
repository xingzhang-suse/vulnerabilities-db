const db = require('../db-connecter.js');

const dbInstnace = db.getDbInstance();
const vulInfo = dbInstnace.use('vulnerabilities_info');
const vulInfoNofix = dbInstnace.use('vulnerabilities_nofix');

const getFullVulsList = (req, res) => {
  vulInfo.list({
    limit: parseInt(req.query.page_size, 10),
    skip: parseInt(req.query.start, 10),
    include_docs: true,
  }, (err, data) => {
    if (err) {
      res.status(err.statusCode).json(
        {
          success: false,
          error: err
        }
      );
    } else {
      res.status(200).json(
        {
          success: true,
          data: data.rows.map(row => row.doc)
        }
      );
    }
  });
};

const getFullNofixVulsList = (req, res) => {
  vulInfoNofix.list({
    limit: parseInt(req.query.page_size, 10),
    skip: parseInt(req.query.start, 10),
    include_docs: true,
  }, (err, data) => {
    if (err) {
      res.status(err.statusCode).json(
        {
          success: false,
          error: err
        }
      );
    } else {
      res.status(200).json(
        {
          success: true,
          data: data.rows.map(row => row.doc)
        }
      );
    }
  });
};

// const getConditionalVulsList = (req, res) => {
//
// };


module.exports = {
  getFullVulsList,
  getFullNofixVulsList
  // getConditionalVulsList
}
