import { Chart } from 'chart.js/auto';
import { changeColorOpacity } from './common.js';

export function renderVerticalBarChart(element, datasets, labels) {

  const ctx = element.getContext('2d');

  const data = {
    labels: labels,
    datasets: datasets
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              if (parseFloat(value) % 1 === 0) return value;
              return null;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  };

  const chart = new Chart(ctx, config);
  return chart;
}


export function renderLineChart(element, datasets, labels) {

  const ctx = element.getContext('2d');

  const data = {
    labels: labels,
    datasets: datasets
  };

  let backgroundColorBak = JSON.parse(JSON.stringify(datasets[0].backgroundColor));

  const config = {
    type: 'line',
    data: data,
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              if (parseFloat(value) % 1 === 0) return value;
              return null;
            }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      },
      onClick: (event, chartElements) => {
        console.log(event, chartElements);
        if (chartElements && chartElements.length > 0) {
          // Get the clicked element
          const element = chartElements[0];

          // Get the label index and label value
          const labelIndex = element.index;
          const labelValue = chart.data.labels[labelIndex];

          // Handle the label click event
          console.log(`Label clicked: Index=${labelIndex}, Value=${labelValue}`);

          chart.data.datasets[0].backgroundColor = JSON.parse(JSON.stringify(backgroundColorBak));
          chart.data.datasets[0].backgroundColor[element.index] = changeColorOpacity(chart.data.datasets[0].backgroundColor[element.index], 1);
          chart.update();
        }
      }
    }
  };

  const chart = new Chart(ctx, config);
  return chart;
}
