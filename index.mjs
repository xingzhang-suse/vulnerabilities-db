import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import getVuls from './server/api-modules/get-vulnerabilities.js';
import insertVuls from './server/api-modules/insert-vulnerabilities.js';
import insertVulsByScore from './server/api-modules/insert-grouped-vuls-by-score.js';
import insertVulsByDate from './server/api-modules/insert-grouped-vuls-by-date.js';
import insertNoFixVuls from './server/api-modules/insert-nofix-vuls.js'
import getStatistic from './server/api-modules/get-statistic.js';
import getVulDetail from './server/api-modules/get-vulnerability-detail.js';

const app = express();

app.get('/', (req, res) => {
  const currentURL = new URL(import.meta.url);
  const currentDir = currentURL.pathname.substring(0, currentURL.pathname.lastIndexOf('/'));
  res.sendFile(path.join(currentDir, '/dist/index.html'));
});

app.use(express.static('dist'));
app.use(bodyParser.json());

app.get('/statistic', (req, res) => {
  getStatistic.getStatisticData(req, res);
});

app.get('/vulnerability/:name', (req, res) => {
  getVulDetail.getVulDetailData(req, res);
});

app.put('/vulnerabilities', (req, res) => {
  if (Object.keys(req.body).length > 0) {
    // getVuls.getConditionalVulsList(req, res);
  } else {
    getVuls.getFullVulsList(req, res);
  }
});

app.put('/vulnerabilities-nofix', (req, res) => {
  if (Object.keys(req.body).length > 0) {
    // getVuls.getConditionalVulsList(req, res);
  } else {
    getVuls.getFullNofixVulsList(req, res);
  }
});

app.post('/vulnerabilities', (req, res) => {
  insertVulsByDate.uploadGroupedVulsByPublishedDate(req, res);
  insertVulsByScore.uploadGroupedVulsByScore(req, res);
  insertNoFixVuls.uploadNofixVuls2Db(req, res);
  insertVuls.uploadVulsList2Db(req, res);
});

const options = {
  key: fs.readFileSync('certs/neuvector-vul-db.key'),
  cert: fs.readFileSync('certs/neuvector-vul-db.crt')
};

const PORT = process.env.PORT || 443;
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
