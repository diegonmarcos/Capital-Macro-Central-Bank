import { Chart, registerables } from 'chart.js';
import { generateTimeSeries } from './data';
import { state } from './state';

Chart.register(...registerables);

let gdpChart: Chart | null = null;
let inflationChart: Chart | null = null;
let nowcastChart: Chart | null = null;

export function destroyCharts(): void {
  gdpChart?.destroy();
  inflationChart?.destroy();
  nowcastChart?.destroy();
  gdpChart = null;
  inflationChart = null;
  nowcastChart = null;
}

export function initDSGECharts(): void {
  const isDark = state.theme === 'dark';
  const gridColor = isDark ? '#334e68' : '#d9e2ec';
  const textColor = isDark ? '#9fb3c8' : '#627d98';

  const gdpData = generateTimeSeries(20, 100, 3);
  const inflationData = generateTimeSeries(20, 2.5, 0.5);

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;

  const gdpCanvas = document.getElementById('gdp-chart') as HTMLCanvasElement | null;
  const inflationCanvas = document.getElementById('inflation-chart') as HTMLCanvasElement | null;

  if (gdpCanvas) {
    gdpChart = new Chart(gdpCanvas, {
      type: 'line',
      data: {
        labels: gdpData.map(d => d.date),
        datasets: [{
          label: 'Actual',
          data: gdpData.map(d => d.value),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }, {
          label: 'Forecast',
          data: gdpData.map(d => d.forecast),
          borderColor: '#22c55e',
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { grid: { color: gridColor }, title: { display: true, text: '% Deviation' } },
          x: { grid: { color: gridColor } }
        }
      }
    });
  }

  if (inflationCanvas) {
    inflationChart = new Chart(inflationCanvas, {
      type: 'line',
      data: {
        labels: inflationData.map(d => d.date),
        datasets: [{
          label: 'Actual',
          data: inflationData.map(d => d.value),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }, {
          label: 'Forecast',
          data: inflationData.map(d => d.forecast),
          borderColor: '#22c55e',
          borderDash: [5, 5],
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { grid: { color: gridColor }, title: { display: true, text: '% YoY' } },
          x: { grid: { color: gridColor } }
        }
      }
    });
  }
}

export function initMLCharts(): void {
  const isDark = state.theme === 'dark';
  const gridColor = isDark ? '#334e68' : '#d9e2ec';
  const textColor = isDark ? '#9fb3c8' : '#627d98';

  const nowcastData = generateTimeSeries(12, 2.0, 0.8);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  Chart.defaults.color = textColor;
  Chart.defaults.borderColor = gridColor;

  const canvas = document.getElementById('nowcast-chart') as HTMLCanvasElement | null;
  if (canvas) {
    nowcastChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: months.map(m => m + ' 2024'),
        datasets: [{
          label: 'Actual',
          data: nowcastData.map(d => d.value),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }, {
          label: 'Nowcast',
          data: nowcastData.map(d => d.value + (Math.random() - 0.5) * 0.3),
          borderColor: '#22c55e',
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'bottom' } },
        scales: {
          y: { grid: { color: gridColor }, title: { display: true, text: '% Growth' } },
          x: { grid: { color: gridColor } }
        }
      }
    });
  }
}
