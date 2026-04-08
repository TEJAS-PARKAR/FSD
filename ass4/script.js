const citySelect = document.getElementById('city-select');
const avgTempEl = document.getElementById('avg-temp');
const avgHumidityEl = document.getElementById('avg-humidity');
const avgWindEl = document.getElementById('avg-wind');
const ctx = document.getElementById('temperatureChart').getContext('2d');

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

const temperatureChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Temperature (°C)',
      borderColor: '#1f77b4',
      backgroundColor: 'rgba(31, 119, 180, 0.12)',
      fill: true,
      tension: 0.3,
      pointRadius: 3,
      borderWidth: 2,
      data: []
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.parsed.y}°C`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: false,
        ticks: { callback: value => `${value}°` }
      }
    }
  }
});

function updateDashboard(cityKey) {
  const city = weatherData[cityKey];
  const avgTemp = Math.round(city.values.reduce((sum, value) => sum + value, 0) / city.values.length);
  const avgHumidity = Math.round(city.humidity.reduce((sum, value) => sum + value, 0) / city.humidity.length);
  const avgWind = Math.round(city.wind.reduce((sum, value) => sum + value, 0) / city.wind.length);

  avgTempEl.textContent = `${avgTemp}°C`;
  avgHumidityEl.textContent = `${avgHumidity}%`;
  avgWindEl.textContent = `${avgWind} km/h`;

  temperatureChart.data.labels = city.labels;
  temperatureChart.data.datasets[0].data = city.values;
  temperatureChart.update();
}

citySelect.addEventListener('change', () => updateDashboard(citySelect.value));
updateDashboard(citySelect.value);
