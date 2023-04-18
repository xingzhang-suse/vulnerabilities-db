import { HttpClient } from '../../infra/core/http-client.js';
import { renderComponent } from '../../infra/core/renderer.js';
import { getGridOptions } from '../../infra/utils/common.js';
import { Grid, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GlobalConstant } from '../../infra/constant/global-constant.js';

export class Nofix {

  start = 0;
  pageSize = GlobalConstant.PAGE_SIZE;
  client = new HttpClient('');
  filter = null;
  vulsGridOptions = null;
  scoreBarChart = null;
  dateLineChart = null;
  tableTitleEl = null;
  pageChangeBtnEl = null;
  backToFullEl = null;
  backgroundColorBak4ScoreBarChart = [];
  backgroundColorBak4DateLineChart = [];
  eof = false;

  constructor() {
    this.templateUrl = './nofix.html';
  }

  async render() {

    const movePrevPage = () => {
      changePage(-1);
    };

    const moveNextPage = () => {
      changePage(1);
    };

    const changePage = (direction) => {
      if ((direction > 0 && this.start >= 0 && !this.eof) || ( this.start > 0 && direction < 0)) {
        this.start = this.start + direction * this.pageSize;
        this.getVulsListByPaging(this.start, this.filter);
      }
    };

    const eventListenerOptions = [
      {
        eventType: 'click',
        eventElement: 'prev-page',
        eventFunc: movePrevPage
      },
      {
        eventType: 'click',
        eventElement: 'next-page',
        eventFunc: moveNextPage
      }
    ];

    return renderComponent(this.templateUrl, eventListenerOptions);
  }

  init(filter) {
    this.tableTitleEl = document.getElementById('table-title');
    this.pageChangeBtnEl = document.getElementById('page-change-btn');
    this.backToFullEl = document.getElementById('back-to-full');
    this.setVulnerabilityGrid();
    this.getVulsListByPaging(this.start, this.filter);
  }

  getVulsListByPaging(start, filter) {
    let paramsStr = `page_size=${this.pageSize}&start=${start}`
    this.client.put('vulnerabilities-nofix', {}, paramsStr).then(data => {
      this.eof = data.data.length < this.pageSize;
      this.vulsGridOptions.api.setRowData(data.data);
      setTimeout(() => {
        this.vulsGridOptions.api.getDisplayedRowAtIndex(0).setSelected(true);
      }, 200);
    });
  }

  backToFullList() {
    this.getVulsListByPaging(this.start, this.filter);
    this.scoreBarChart.data.datasets[0].backgroundColor = JSON.parse(JSON.stringify(this.backgroundColorBak4ScoreBarChart));
    this.dateLineChart.data.datasets[0].backgroundColor = JSON.parse(JSON.stringify(this.backgroundColorBak4DateLineChart));
    this.dateLineChart.update();
    this.scoreBarChart.update();
    this.tableTitleEl.textContent = 'Full data list';
    this.backToFullEl.textContent = '';
    this.pageChangeBtnEl.style.visibility = 'visible';
  }

  setVulnerabilityGrid(rowData) {

    const vulsGridElement = document.querySelector('#vulsGrid');

    const nameRenderer = params => {
      const cellValue = params.value;
      const linkElement = document.createElement('a');
      linkElement.className = 'link';
      linkElement.textContent = cellValue;
      linkElement.addEventListener('click', () => {
        this.goToVulDetail(cellValue);
      });

      return linkElement;
    };

    const columnDefs4Vuls = [
      {
        headerName: 'Name',
        field: 'name',
        cellRenderer: nameRenderer,
        width: 280
      },
      {
        headerName: 'Description',
        field: 'description',
        width:500
      },
      {
        field: 'severity',
        hide: true
      },
      {
        headerName: 'Vectors',
        field: 'vectors',
        width:200
      },
      {
        headerName: 'Score V2',
        field: 'score',
        cellRenderer: params => {
          return `<div class="progress-bar ${params.data.severity.toLowerCase() === 'high' ? 'bg-danger' : 'bg-warning'}" style="height: 25px; width: ${params.value * 10}%;">${params.value}</div>`;
        },
        width: 150,
        minWidth: 150,
        maxWidth: 150
      },
      {
        headerName: 'Score V3',
        field: 'score_v3',
        cellRenderer: params => {
          return `<div class="progress-bar ${params.data.severity.toLowerCase() === 'high' ? 'bg-danger' : 'bg-warning'}" style="height: 25px; width: ${params.value * 10}%;">${params.value}</div>`;
        },
        width: 150,
        minWidth: 150,
        maxWidth: 150
      }
    ];

    this.vulsGridOptions = getGridOptions(
      columnDefs4Vuls
    );
    new Grid(vulsGridElement, this.vulsGridOptions);
  }

  goToVulDetail(vulName) {
    location.href = `#/detail/${vulName}`;
  }
}
