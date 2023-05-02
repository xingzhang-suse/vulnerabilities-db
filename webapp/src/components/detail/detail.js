import { renderComponent } from '../../infra/core/renderer.js';
import { HttpClient } from '../../infra/core/http-client.js';
import { Grid, GridOptions } from 'ag-grid-community';
import { getGridOptions } from '../../infra/utils/common.js';
import { GlobalConstant } from '../../infra/constant/global-constant.js';
import moment from 'moment';
import $ from 'jquery';

export class Detail {

  client = new HttpClient('');

  constructor() {
    this.templateUrl = './detail.html';
  }

  async render() {
    return renderComponent(this.templateUrl);
  }

  init(params){
    console.log(params);
    this.getDetailsData(params[0]);
  }

  getDetailsData(vulName) {
    this.client.get(`vulnerability/${vulName}`).then(
      data => {
        this.renderDetail(data.data);
      }
    )
  }

  renderDetail(detail) {
    console.log(detail)
    const nameEl = document.getElementById('title');
    const vectorsV3El = document.getElementById('vectors_v3');
    const vectorsV2El = document.getElementById('vectors');
    const scoreV3El = document.getElementById('score_v3');
    const scoreV2El = document.getElementById('score');
    const entriesEl = document.getElementById('entries');
    const entriesCntEl = document.getElementById('entries-count');

    nameEl.innerText = detail.Name;
    vectorsV3El.innerText = detail.VectorsV3;
    vectorsV2El.innerText = detail.Vectors;
    scoreV3El.innerText = detail.ScoreV3;
    scoreV2El.innerText = detail.Score;

    entriesCntEl.innerText = `( ${ detail.Entries.length} )`;

    const entriesHTML = detail.Entries.map((entry, index) => {
      return this.renderEntries(entry, index);
    }).join('');

    entriesEl.innerHTML = entriesHTML;
  }

  getPackageTable(entry, index) {
    return `<div class="package-table">
      <div>
        <div>Package</div>
        <div>Version</div>
      </div>
      ${entry.Packages.map(_package => {
        return `<div>
          <div>${_package.Package}</div>
          <div>${_package.FixedVersion === '#MINV#' ? 'Not Fixed' : _package.FixedVersion}</div>
        </div>`;
      }).join('')}
    </div>`
  }

  renderEntries(entry, index) {
    let packagesTable = this.getPackageTable(entry, index);
    return `<div class="source-item d-flex justify-content-between">
      <div class="mx-4">
        <div class="source-item-title">
          <div>
            OS / Application
          </div>
          <div>
            ${entry.OSApp}
          </div>
        </div>
        <div class="source-item-title">
          <div>
            Version
          </div>
          <div>
            ${entry.OSAppVersion}
          </div>
        </div>
        <div class="source-item-title">
          <div>
            Last Modified at
          </div>
          <div>
            ${entry.LastModifiedDate}
          </div>
        </div>
      </div>
      <div class="flex-grow-2 mx-4">
        ${packagesTable}
      </div>
    </div>`;
  }
}
