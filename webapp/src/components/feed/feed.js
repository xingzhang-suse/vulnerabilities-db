import { HttpClient } from '../../infra/core/http-client.js';
import { renderComponent } from '../../infra/core/renderer.js';

export class Feed {

  feedsDropdownEl = null;
  versionsDropdownEl = null;
  cvesEl = null;

  feedViewData = {
    "ubuntu": {
      "10.2.1": ["CVE-2022-002", "CVE-2012-002"]
    },
    "redhat": {
      "9.0.1": ["CVE-2022-003", "CVE-2021-003"],
      "10.3.21": ["CVE-2021-903", "CVE-2021-904", "CVE-2021-905", "CVE-2022-693"]
    }
  };

  constructor() {
    this.templateUrl = './feed.html';
  }

  async render() {
    const changeFeed = () => {
      let selectedFeed = document.getElementById('feeds').value;
      this.renderVersionsDropdown(selectedFeed);
    };
    const changeVersion = () => {
      let selectedFeed = document.getElementById('feeds').value;
      let selectedVersion = document.getElementById('versions').value;
      this.renderCves(selectedFeed, selectedVersion);
    };
    const eventListenerOptions = [
      {
        eventType: 'change',
        eventElement: 'feeds',
        eventFunc: changeFeed
      },
      {
        eventType: 'change',
        eventElement: 'versions',
        eventFunc: changeVersion
      }
    ];
    return renderComponent(this.templateUrl, eventListenerOptions);
  }

  init() {
    this.feedsDropdownEl = document.getElementById('feeds');
    this.versionsDropdownEl = document.getElementById('versions');
    this.cvesEl = document.getElementById('cves');
    this.getFeedViewData();
  }

  getFeedViewData() {
    this.renderFeedsDropdown();
  }

  renderFeedsDropdown() {
    const feeds = Object.keys(this.feedViewData);
    const packageOptionsHTML = feeds.map(packageName => {
      return `<option value="${packageName}">${packageName}</option>`;
    }).join('');
    this.feedsDropdownEl.innerHTML = packageOptionsHTML;
    this.renderVersionsDropdown(feeds[0]);
  }

  renderVersionsDropdown(selectedFeed) {
    let versions = Object.keys(this.feedViewData[selectedFeed]);
    let versionOptionsHTML = versions.map(version => {
      return `<option value="${version}">${version}</option>`;
    }).join('');
    this.versionsDropdownEl.innerHTML = versionOptionsHTML;
    this.renderCves(selectedFeed, versions[0]);
  }

  renderCves(selectedFeed, selectedVersion) {
    let cves = this.feedViewData[selectedFeed][selectedVersion];
    let cvesHTML = cves.map(cve => {
      return `<div class="m-2"><a href="#/detail/${cve}">${cve}</a></div>`;
    }).join('');
    this.cvesEl.innerHTML = cvesHTML;
  }
}
