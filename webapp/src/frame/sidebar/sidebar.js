import { HttpClient } from '../../infra/core/http-client.js';
import { renderComponent, renderDynamicElement } from '../../infra/core/renderer.js';
import { FILTER_AVAILABLE_PATHS } from '../../routes.js';
import { Home } from '../../components/home/home.js';

export class Sidebar {

  categoryEl = null;
  valueEl = null;
  addFilterBtnEl = null;
  searchBtnEl = null;
  clearBtnEl = null;
  filterListEl = null;
  client = new HttpClient();

  constructor() {
    this.templateUrl = './sidebar.html';
  }

  async render() {
    const changeCategory = () => {
      this.valueEl.value = '';
      this.addFilterBtnEl.disabled = this.isFilterInValid();
    };
    const changeValue  = () => {
      this.addFilterBtnEl.disabled = this.isFilterInValid();
    };
    const addFilter = () => {
      this.addFilterTag(this.categoryEl.value, this.valueEl.value);
    };
    const searchByFilter = () => {
      this.searchVuls(this.filterListEl);
    };
    const clearFilter = () => {
      while (this.filterListEl.firstChild) {
        this.filterListEl.removeChild(this.filterListEl.firstChild);
      }
    };
    const eventListenerOptions = [
      {
        eventType: 'change',
        eventElement: 'search-category',
        eventFunc: changeCategory
      },
      {
        eventType: 'keyup',
        eventElement: 'search-value',
        eventFunc: changeValue
      },
      {
        eventType: 'click',
        eventElement: 'add-filter-btn',
        eventFunc: addFilter
      },
      {
        eventType: 'click',
        eventElement: 'search-btn',
        eventFunc: searchByFilter
      },
      {
        eventType: 'click',
        eventElement: 'clear-btn',
        eventFunc: clearFilter
      }
    ];
    return renderComponent(this.templateUrl, eventListenerOptions);
  }

  init() {
    window.addEventListener('hashchange', this.toggleFilterDisplay.bind(this));
    this.toggleFilterDisplay();

    this.categoryEl = document.getElementById('search-category');
    this.valueEl = document.getElementById('search-value');
    this.addFilterBtnEl = document.getElementById('add-filter-btn');
    this.searchBtnEl = document.getElementById('search-btn');
    this.clearBtnEl = document.getElementById('clear-btn');
    this.filterListEl = document.getElementById('filter-list');

    this.verifyBtn();
  }

  toggleFilterDisplay() {
    const hashPath = window.location.hash.substr(2) || '/';
    const deserializedHashPath = hashPath.split('/');
    const path = `/${deserializedHashPath[0]}`;
    const filterEl = document.getElementById('filter');
    filterEl.style.display = FILTER_AVAILABLE_PATHS.includes(path) ? 'block' : 'none';
  }

  isFilterInValid() {
    return this.categoryEl.value === '' || this.valueEl.value === '';
  }

  isFilterListEmpty() {
    return !this.filterListEl.children || this.filterListEl.children.length === 0;
  }

  addFilterTag(category, value) {
    let tagId = `tag-${this.filterListEl.children.length}`;

    const removeTag = (id) => {
      const tagEl = document.getElementById(id);
      this.filterListEl.removeChild(tagEl.parentElement);
      this.verifyBtn();
    };

    const eventListenerOptions = [
      {
        eventType: 'click',
        eventElement: tagId,
        eventFunc: removeTag.bind(this, tagId)
      }
    ];

    const tagHTML =
      `<li class="filter-tag d-flex justify-content-between" data-category="${category}" data-value="${value}" >
        <div data-toggle="tooltip" data-placement="top" title="${category}=${value}">${category}=${value.length > 10 ? `${value.substring(0, 10)}...` : value}</div>
        <div id="${tagId}" class="link">&#x2715;</div>
      </li>`;

    if (
      this.filterListEl.children &&
      this.filterListEl.children.length > 0 &&
      this.isDuplicateFilter(
        Array.from(this.filterListEl.children),
        {
          category,
          value
        }
      )
    ) {
      alert("Filter is already existing!");
    } else {
      this.filterListEl = renderDynamicElement(tagHTML, this.filterListEl, eventListenerOptions);
      this.initInput(category);
      this.verifyBtn();
    }
  }

  searchVuls(filterListEl) {
    let filterList = Array.from(filterListEl.children).map(filterEl => {
      return {
        category: filterEl.getAttribute('data-category'),
        value: filterEl.getAttribute('data-value')
      };
    });
    console.log(filterList);
    (new Home()).getVulsListByPaging(0);
  }

//=======================================================================

  isDuplicateFilter(filtersEl, filterObj) {
    return filtersEl.reduce((accResult, filterEl) => {
      let _filterObj = {
        category: filterEl.getAttribute('data-category'),
        value: filterEl.getAttribute('data-value')
      };
      return  accResult = accResult || (_filterObj.category === filterObj.category && _filterObj.value === filterObj.value);
    }, false);
  }

  initInput(currCategory) {
    this.categoryEl.value = currCategory || 'Name';
    this.valueEl.value = '';
  }

  verifyBtn() {
    this.addFilterBtnEl.disabled = this.isFilterInValid();
    this.searchBtnEl.disabled = this.isFilterListEmpty();
    this.clearBtnEl.disabled = this.isFilterListEmpty();
  }

}
