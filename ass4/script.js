const citySelect = document.getElementById('city-select');
const avgTempEl = document.getElementById('avg-temp');
const avgHumidityEl = document.getElementById('avg-humidity');
const avgWindEl = document.getElementById('avg-wind');

const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
const climateCtx = document.getElementById('climateChart').getContext('2d');
const DEG = '\u00B0';

const weatherData = {
  newYork: {
    values: [16, 18, 20, 21, 19, 17, 15],
    humidity: [60, 55, 58, 62, 64, 63, 61],
    wind: [14, 18, 16, 13, 12, 15, 17],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  london: {
    values: [13, 14, 15, 14, 13, 12, 11],
    humidity: [72, 70, 68, 65, 67, 69, 71],
    wind: [10, 12, 11, 9, 8, 12, 13],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  tokyo: {
    values: [22, 24, 26, 25, 23, 22, 21],
    humidity: [55, 52, 54, 57, 59, 58, 56],
    wind: [8, 10, 9, 11, 10, 9, 8],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  sydney: {
    values: [18, 19, 20, 22, 23, 22, 21],
    humidity: [58, 60, 57, 55, 54, 56, 59],
    wind: [12, 14, 13, 11, 10, 12, 13],
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  }
};

Chart.defaults.font.family = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
Chart.defaults.color = '#5b6b87';

const sharedGrid = {
  color: 'rgba(148, 163, 184, 0.18)',
  drawBorder: false
};

const temperatureChart = new Chart(temperatureCtx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: `Temperature (${DEG}C)`,
      borderColor: '#2563eb',
      backgroundColor: 'rgba(37, 99, 235, 0.16)',
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#ffffff',
      pointBorderColor: '#2563eb',
      pointBorderWidth: 2,
      borderWidth: 3,
      data: []
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        callbacks: {
          label: (context) => `${context.parsed.y}${DEG}C`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: false,
        grid: sharedGrid,
        ticks: {
          callback: (value) => `${value}${DEG}`
        }
      }
    }
  }
});

const climateChart = new Chart(climateCtx, {
  data: {
    labels: [],
    datasets: [
      {
        type: 'bar',
        label: 'Humidity (%)',
        data: [],
        backgroundColor: 'rgba(37, 99, 235, 0.72)',
        borderRadius: 10,
        borderSkipped: false,
        yAxisID: 'humidityAxis'
      },
      {
        type: 'line',
        label: 'Wind (km/h)',
        data: [],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.18)',
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#10b981',
        pointBorderWidth: 2,
        borderWidth: 3,
        fill: false,
        yAxisID: 'windAxis'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      humidityAxis: {
        type: 'linear',
        position: 'left',
        grid: sharedGrid,
        ticks: {
          callback: (value) => `${value}%`
        }
      },
      windAxis: {
        type: 'linear',
        position: 'right',
        grid: { display: false },
        ticks: {
          callback: (value) => `${value} km/h`
        }
      }
    }
  }
});

function average(values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function updateDashboard(cityKey) {
  const city = weatherData[cityKey];

  avgTempEl.textContent = `${average(city.values)}${DEG}C`;
  avgHumidityEl.textContent = `${average(city.humidity)}%`;
  avgWindEl.textContent = `${average(city.wind)} km/h`;

  temperatureChart.data.labels = city.labels;
  temperatureChart.data.datasets[0].data = city.values;
  temperatureChart.update();

  climateChart.data.labels = city.labels;
  climateChart.data.datasets[0].data = city.humidity;
  climateChart.data.datasets[1].data = city.wind;
  climateChart.update();
}

citySelect.addEventListener('change', () => updateDashboard(citySelect.value));
updateDashboard(citySelect.value);
