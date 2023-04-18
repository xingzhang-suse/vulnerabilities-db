import { GlobalConstant } from '../constant/global-constant.js';
import $ from 'jquery';

export function captitalize(word) {
  return word ? `${word.substring(0, 1).toUpperCase()}${word.substring(1).toLowerCase()}` : '';
}

export function getGridOptions(columnDef, options) {
  return {
    defaultColDef: {
      resizable: true,
      sortable: true,
    },
    columnDefs: columnDef,
    suppressDragLeaveHidesColumns: true,
    rowSelection: 'single',
    headerHeight: 30,
    rowHeight: 30,
    animateRows: true,
    onSelectionChanged: options ? options.onSelectionChanged : null,
    onGridReady: params => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      }, 300);
      $(window).on(GlobalConstant.AG_GRID_RESIZE, () => {
        setTimeout(() => {
          params.api.sizeColumnsToFit();
        }, 100);
      });
    }
  };
}

export function changeColorOpacity(rbgaStr, opacity) {
  let rgbaVal = getRGBAValues(rbgaStr);
  rgbaVal.alpha = opacity;
  return setRGBAValue(rgbaVal);
}

function getRGBAValues(rgbaString) {
  const rgbaOnly = rgbaString.replace(/rgba\(|\)/g, '').replace(/\s+/g, '');

  const rgbaArray = rgbaOnly.split(',');

  const red = parseInt(rgbaArray[0]);
  const green = parseInt(rgbaArray[1]);
  const blue = parseInt(rgbaArray[2]);
  const alpha = parseFloat(rgbaArray[3]);

  return {
    red: red,
    green: green,
    blue: blue,
    alpha: alpha
  };
}

function setRGBAValue(rgbaObj) {
  return `rgba(${rgbaObj.red}, ${rgbaObj.green}, ${rgbaObj.blue}, ${rgbaObj.alpha})`;
}
