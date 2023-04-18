import { renderComponent } from '../../infra/core/renderer.js';
import { HttpClient } from '../../infra/core/http-client.js';
import { Grid, GridOptions } from 'ag-grid-community';
import { getGridOptions } from '../../infra/utils/common.js';
import { GlobalConstant } from '../../infra/constant/global-constant.js';
import moment from 'moment';
import $ from 'jquery';

export class Detail {

  client = new HttpClient('');
  sourcesGridOptions = null;

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
    const descriptionEl = document.getElementById('description');
    const vectorsV3El = document.getElementById('vectors_v3');
    const vectorsV2El = document.getElementById('vectors');
    const scoreV3El = document.getElementById('score_v3');
    const scoreV2El = document.getElementById('score');
    const sourcesEl = document.getElementById('sources');
    const sourcesCntEl = document.getElementById('sources-count');

    nameEl.innerText = detail.name;
    descriptionEl.innerText = detail.description;
    vectorsV3El.innerText = detail.vectors_v3;
    vectorsV2El.innerText = detail.vectors;
    scoreV3El.innerText = detail.score_v3;
    scoreV2El.innerText = detail.score;

    sourcesCntEl.innerText = `( ${ detail.sources.length} )`;

    const sourcesHTML = detail.sources.map(source => {
      return this.renderSources(source);
    }).join('');

    sourcesEl.innerHTML = sourcesHTML;
  }

  renderSources(source) {
    return `<div class="source-item">
      <div class="source-item-title">
        <div>
          Feed
        </div>
        <div>
          <a class="link" href="${source.link}">${source.feed}</a>
        </div>
      </div>
      <div class="source-item-title">
        <div>
          Feed Version
        </div>
        <div>
          ${source.feed_version}
        </div>
      </div>
      <div class="source-item-title">
        <div>
          package
        </div>
        <div>
          ${source.package_name}
          (
            <span class="impacted-version">${source.package_version}</span>
            &#8594;
            <span style="display: ${source.fixed_version ? 'none' : 'inline'}">Not fixed</span>
            <span class="fixed-version" style="display: ${source.fixed_version ? 'inline' : 'none'}">${source.fixed_version}</span>
          )
        </div>
      </div>
      <div class="source-item-title">
        <div>
          Rating
        </div>
        <div>
          ${source.rating}
        </div>
      </div>
      <div class="source-item-title">
        <div>
          Published at
        </div>
        <div>
          ${moment(source.published_timestamp * 1000).format('MMM-DD-YYYY hh:mm:ss')}
        </div>
      </div>
      <div class="source-item-title">
        <div>
          CPEs
        </div>
        <div>
          ${source.cpes.join(', ')}
        </div>
      </div>
      <div class="source-item-title">
        <div>
          CVEs
        </div>
        <div>
          ${source.cves.join(', ')}
        </div>
      </div>
    </div>`;
  }
}
