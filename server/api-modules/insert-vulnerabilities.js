const db = require('../db-connecter.js');

const dbInstnace = db.getDbInstance();
const vulInfo = dbInstnace.use('vulnerabilities_info');

const uploadVulsList2Db = (req, res) => {
  dbInstnace.destroy('vulnerabilities_info', (err, body) => {
    if (err && err.statusCode !== 404) {
      console.error(err);
      res.status(err.statusCode).json(err);
    } else {
      console.log('vulnerabilities_info table is removed');
      dbInstnace.create('vulnerabilities_info', (err, body) => {
        if (err) {
          console.error(err);
          res.status(err.statusCode).json(err);
        } else {
          console.log('vulnerabilities_info table is created');
          insertFullVulsList(req, res);
        }
      });
    }
  });
}

const insertFullVulsList = (req, res) => {
  vulInfo.bulk({
    docs: req.body.Vulnerabilities,
  }, {include_docs: true}, (err, data) => {
    if (err) {
      res.status(err.statusCode).json(
        {
          success: false,
          error: err
        }
      );
    } else {
      // createVulsViews();
      res.status(201).json(
        {
          success: true,
          data: data
        }
      );
    }
  });
};

const createVulsViews = () => {
  const view = {
    _id: '_design/mydesign',
    views: {
      groupByCategory: {
        map: (doc) => {
          console.log(doc)
          emit(doc.severity, doc);
        },
        reduce: (key, values) => {
          return values.reduce(function (res, elem) {
            (res[elem[key]] = res[elem[key]] || []).push(elem);
            return res;
          }, {});
        }
      }
    }
  };
  vulInfo.insert(view, (err, body) => {
    if (err) {
      console.error(err);
    } else {
      console.log('View created successfully', body);
    }
  });
};

module.exports = {
  uploadVulsList2Db
}
