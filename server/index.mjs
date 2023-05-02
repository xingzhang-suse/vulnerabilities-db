import express from 'express';
import https from 'https';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import getVuls from './api-modules/get-vulnerabilities.js';
import insertVuls from './api-modules/insert-vulnerabilities.js';
import insertVulsByScore from './api-modules/insert-grouped-vuls-by-score.js';
import insertVulsByDate from './api-modules/insert-grouped-vuls-by-date.js';
import insertNoFixVuls from './api-modules/insert-nofix-vuls.js'
import getStatistic from './api-modules/get-statistic.js';
import getVulDetail from './api-modules/get-vulnerability-detail.js';
import cookieParser from 'cookie-parser';

const app = express();

const genAPIKey = () => {
  //create a base-36 string that contains 30 chars in a-z,0-9
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');
};

let _apiKey = genAPIKey();

app.get('/', (req, res) => {
  const currentURL = new URL(import.meta.url);
  const currentDir = currentURL.pathname.substring(0, currentURL.pathname.lastIndexOf('/'));
  res.cookie('key', _apiKey).sendFile(path.join(currentDir, '../dist/index.html'));
});

app.use(express.static('dist'));
app.use(bodyParser.json({ limit: '600mb' }));
app.use(bodyParser.urlencoded({ limit: '600mb', extended: true }));
app.use(cookieParser());

app.get('/statistic', (req, res) => {
  getStatistic.getStatisticData(req, res);
});

app.get('/vulnerability/:name', (req, res) => {
  getVulDetail.getVulDetailData(req, res);
});

app.put('/vulnerabilities', (req, res) => {
  console.log(req.cookies.key, _apiKey)
  if (req.cookies.key === _apiKey) {
    if (Object.keys(req.body).length > 0) {
      // getVuls.getConditionalVulsList(req, res);
    } else {
      getVuls.getFullVulsList(req, res);
    }
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
  insertVulsByDate.uploadGroupedVulsByLastModifiedDate(req, res);
  insertVulsByScore.uploadGroupedVulsByScore(req, res);
  // insertNoFixVuls.uploadNofixVuls2Db(req, res);
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
