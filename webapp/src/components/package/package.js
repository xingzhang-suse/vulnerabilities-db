import { HttpClient } from '../../infra/core/http-client.js';
import { renderComponent } from '../../infra/core/renderer.js';

export class Package {

  packagesDropdownEl = null;
  versionsDropdownEl = null;
  cvesEl = null;

  packageViewData = {
    "sqlite3.js": {
      "1.0.2": ["CVE-2022-002", "CVE-2012-002"]
    },
    "openssl.js": {
      "3.2.1": ["CVE-2022-003", "CVE-2021-003"],
      "1.2.3": ["CVE-2021-903", "CVE-2021-904", "CVE-2021-905", "CVE-2022-693"]
    }
  };

  constructor() {
    this.templateUrl = './package.html';
  }

  async render() {
    const changePackage = () => {
      let selectedPackage = document.getElementById('packages').value;
      this.renderVersionsDropdown(selectedPackage);
    };
    const changeVersion = () => {
      let selectedPackage = document.getElementById('packages').value;
      let selectedVersion = document.getElementById('versions').value;
      this.renderCves(selectedPackage, selectedVersion);
    };
    const eventListenerOptions = [
      {
        eventType: 'change',
        eventElement: 'packages',
        eventFunc: changePackage
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
    this.packagesDropdownEl = document.getElementById('packages');
    this.versionsDropdownEl = document.getElementById('versions');
    this.cvesEl = document.getElementById('cves');
    this.getPackageViewData();
  }

  getPackageViewData() {
    this.renderPackagesDropdown();
  }

  renderPackagesDropdown() {
    const packages = Object.keys(this.packageViewData);
    const packageOptionsHTML = packages.map(packageName => {
      return `<option value="${packageName}">${packageName}</option>`;
    }).join('');
    this.packagesDropdownEl.innerHTML = packageOptionsHTML;
    this.renderVersionsDropdown(packages[0]);
  }

  renderVersionsDropdown(selectedPackage) {
    let versions = Object.keys(this.packageViewData[selectedPackage]);
    let versionOptionsHTML = versions.map(version => {
      return `<option value="${version}">${version}</option>`;
    }).join('');
    this.versionsDropdownEl.innerHTML = versionOptionsHTML;
    this.renderCves(selectedPackage, versions[0]);
  }

  renderCves(selectedPackage, selectedVersion) {
    let cves = this.packageViewData[selectedPackage][selectedVersion];
    let cvesHTML = cves.map(cve => {
      return `<div class="m-2"><a href="#/detail/${cve}">${cve}</a></div>`;
    }).join('');
    this.cvesEl.innerHTML = cvesHTML;
  }
}
