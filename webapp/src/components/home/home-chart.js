import { renderVerticalBarChart, renderLineChart } from '../../infra/utils/chart-utils.js';

export function renderScoreBarChart(vulsByScore) {
  let labels = new Array(10);
  labels.fill('');
  labels = labels.map((val, index) => `${index}-${index + 1}`);
  let datasets = [{
    label: 'Score base vulnerabilities',
    data: vulsByScore.map(vul => vul.length),
    backgroundColor: [
      'rgba(0, 196, 0, 0.2)',
      'rgba(0, 224, 32, 0.2)',
      'rgba(0, 240, 0, 0.2)',
      'rgba(209, 255, 0, 0.2)',
      'rgba(255, 224, 0, 0.2)',
      'rgba(255, 204, 0, 0.2)',
      'rgba(255, 188, 16, 0.2)',
      'rgba(255, 156, 32, 0.2)',
      'rgba(255, 128, 0, 0.2)',
      'rgba(255, 0, 0, 0.2)'
    ],
    borderColor: [
      'rgba(0, 196, 0, 1)',
      'rgba(0, 224, 32, 1)',
      'rgba(0, 240, 0, 1)',
      'rgba(209, 255, 0, 1)',
      'rgba(255, 224, 0, 1)',
      'rgba(255, 204, 0, 1)',
      'rgba(255, 188, 16, 1)',
      'rgba(255, 156, 32, 1)',
      'rgba(255, 128, 0, 1)',
      'rgba(255, 0, 0, 1)'
    ],
    borderWidth: 1
  }];
  let element = document.getElementById('score-bar-chart');
  return renderVerticalBarChart(element, datasets, labels);
}

export function renderDateLineChart(vlusByDate) {
  let labels = new Array(10);
  labels.fill('');
  labels = vlusByDate.map(vul => `${vul.yearMonth.substring(0, 4)}-${vul.yearMonth.substring(4)}`);
  let datasets = [{
    label: 'Month base vulnerabilities (Latest 10)',
    data: vlusByDate.map(vul => vul.vuls.length),
    backgroundColor: new Array(vlusByDate.length).fill('rgba(255, 0, 0, 0.2)'),
    borderColor: 'rgba(255, 0, 0, 0.2)',
    borderWidth: 3,
    radius: 5
  }];
  let element = document.getElementById('date-bar-chart');
  const dateLineChart = renderLineChart(element, datasets, labels);

  

  return dateLineChart;
};
