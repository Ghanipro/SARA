document.addEventListener('DOMContentLoaded', function () {
    const uploadForm = document.getElementById('uploadForm');
    const csvFileInput = document.getElementById('csvFile');
  
    // Object to store all chart instances
    let charts = {};
  
    uploadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const file = csvFileInput.files[0];
      if (file) {
        parseCSV(file);
      }
    });
  
    function parseCSV(file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const data = rows.slice(1);
  
        // Perform EDA and generate charts
        generateCharts(headers, data);
      };
      reader.readAsText(file);
    }
  
    function generateCharts(headers, data) {
      // Destroy existing charts before generating new ones
      destroyCharts();
  
      // Example: Generate Sales Trends Chart
      const salesData = data.map(row => parseInt(row[1])); // Assuming sales data is in the second column
      const salesLabels = data.map(row => row[0]); // Assuming dates are in the first column
  
      charts.salesTrendsChart = new Chart(document.getElementById('salesTrendsChart'), {
        type: 'line',
        data: {
          labels: salesLabels,
          datasets: [{
            label: 'Sales ($)',
            data: salesData,
            backgroundColor: 'rgba(99, 102, 241, 0.2)',
            borderColor: 'rgba(99, 102, 241, 1)',
            borderWidth: 2,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
  
      // Example: Generate Product Performance Chart
      const productData = data.map(row => parseInt(row[2])); // Assuming product data is in the third column
      const productLabels = headers.slice(2); // Assuming product names are in the headers
  
      charts.productPerformanceChart = new Chart(document.getElementById('productPerformanceChart'), {
        type: 'bar',
        data: {
          labels: productLabels,
          datasets: [{
            label: 'Units Sold',
            data: productData,
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            borderColor: 'rgba(245, 158, 11, 1)',
            borderWidth: 2,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
  
      // Example: Generate Inventory Turnover Chart
      const inventoryData = data.map(row => parseFloat(row[3])); // Assuming inventory data is in the fourth column
      const inventoryLabels = ['Q1', 'Q2', 'Q3', 'Q4']; // Example labels
  
      charts.inventoryTurnoverChart = new Chart(document.getElementById('inventoryTurnoverChart'), {
        type: 'bar',
        data: {
          labels: inventoryLabels,
          datasets: [{
            label: 'Turnover Ratio',
            data: inventoryData,
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 2,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
  
      // Example: Generate Profit Margins Chart
      const profitData = data.map(row => parseFloat(row[4])); // Assuming profit data is in the fifth column
      const profitLabels = headers.slice(4); // Assuming profit categories are in the headers
  
      charts.profitMarginsChart = new Chart(document.getElementById('profitMarginsChart'), {
        type: 'pie',
        data: {
          labels: profitLabels,
          datasets: [{
            label: 'Profit Margin (%)',
            data: profitData,
            backgroundColor: [
              'rgba(239, 68, 68, 0.2)',
              'rgba(99, 102, 241, 0.2)',
              'rgba(245, 158, 11, 0.2)',
              'rgba(16, 185, 129, 0.2)',
            ],
            borderColor: [
              'rgba(239, 68, 68, 1)',
              'rgba(99, 102, 241, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(16, 185, 129, 1)',
            ],
            borderWidth: 2,
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    }
  
    function destroyCharts() {
      for (const chart in charts) {
        if (charts[chart]) {
          charts[chart].destroy();
        }
      }
      charts = {};
    }
  });