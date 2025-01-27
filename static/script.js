document.addEventListener("DOMContentLoaded", function () {
    // Fetch and render Sales Trends
    fetch("/api/sales-trends")
      .then((response) => response.json())
      .then((data) => {
        const dates = [...new Set(data.map((sale) => sale.date))].reverse();
        const revenueByDate = dates.map((date) =>
          data.filter((sale) => sale.date === date).reduce((sum, sale) => sum + sale.revenue, 0)
        );
  
        new Chart(document.getElementById("salesTrendsChart"), {
          type: "line",
          data: {
            labels: dates,
            datasets: [
              {
                label: "Revenue",
                data: revenueByDate,
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
              },
            ],
          },
        });
      });
  
    // Fetch and render Product Performance
    fetch("/api/product-performance")
      .then((response) => response.json())
      .then((data) => {
        new Chart(document.getElementById("productPerformanceChart"), {
          type: "bar",
          data: {
            labels: data.map((product) => product.name),
            datasets: [
              {
                label: "Total Sales",
                data: data.map((product) => product.total_sales),
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
        });
      });
  
    // Fetch and render Inventory Turnover
    fetch("/api/inventory-turnover")
      .then((response) => response.json())
      .then((data) => {
        new Chart(document.getElementById("inventoryTurnoverChart"), {
          type: "bar",
          data: {
            labels: data.map((product) => product.name),
            datasets: [
              {
                label: "Turnover Ratio",
                data: data.map((product) => product.turnover_ratio),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          },
        });
      });
  
    // Fetch and render Profit Margins
    fetch("/api/profit-margins")
      .then((response) => response.json())
      .then((data) => {
        new Chart(document.getElementById("profitMarginsChart"), {
          type: "bar",
          data: {
            labels: data.map((product) => product.name),
            datasets: [
              {
                label: "Profit Margin (%)",
                data: data.map((product) => product.profit_margin),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
              },
            ],
          },
        });
      });
  
    // Fetch and render Customer Insights
    fetch("/api/customer-insights")
      .then((response) => response.json())
      .then((data) => {
        const insightsDiv = document.getElementById("customerInsights");
        insightsDiv.innerHTML = `
          <p><strong>Total Customers:</strong> ${data.total_customers}</p>
          <p><strong>Average Age:</strong> ${data.average_age}</p>
          <p><strong>Gender Distribution:</strong> Male - ${data.gender_distribution.Male}, Female - ${data.gender_distribution.Female}</p>
          <p><strong>Top Spenders:</strong></p>
          <ul>
            ${data.top_spenders.map((customer) => `<li>${customer.name} - $${customer.total_spent}</li>`).join("")}
          </ul>
        `;
      });
  });


// Fetch and render Replenishment Alerts
fetch("/api/replenishment-alerts")
.then((response) => response.json())
.then((data) => {
  const tableBody = document.getElementById("replenishmentAlerts");
  data.forEach((alert) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${alert.name}</td>
      <td class="py-2 px-4 border-b">${alert.refill_date}</td>
      <td class="py-2 px-4 border-b">${alert.days_until_stockout}</td>
    `;
    tableBody.appendChild(row);
  });
});

// Fetch and render Stock-Out Predictions
fetch("/api/stockout-predictions")
.then((response) => response.json())
.then((data) => {
  const tableBody = document.getElementById("stockoutPredictions");
  data.forEach((prediction) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${prediction.name}</td>
      <td class="py-2 px-4 border-b">${prediction.days_until_stockout}</td>
      <td class="py-2 px-4 border-b">${prediction.suggestion}</td>
    `;
    tableBody.appendChild(row);
  });
});

// Fetch and render Dead Stock
fetch("/api/dead-stock")
.then((response) => response.json())
.then((data) => {
  const tableBody = document.getElementById("deadStock");
  data.forEach((stock) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${stock.name}</td>
      <td class="py-2 px-4 border-b">${stock.suggestion}</td>
    `;
    tableBody.appendChild(row);
  });
});

// Fetch and render Pricing Strategies
fetch("/api/pricing-strategies")
.then((response) => response.json())
.then((data) => {
  const tableBody = document.getElementById("pricingStrategies");
  data.forEach((strategy) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${strategy.name}</td>
      <td class="py-2 px-4 border-b">$${strategy.current_price.toFixed(2)}</td>
      <td class="py-2 px-4 border-b">$${strategy.suggested_price.toFixed(2)}</td>
      <td class="py-2 px-4 border-b">${strategy.reason}</td>
    `;
    tableBody.appendChild(row);
  });
});

// Fetch and render Discount Optimization
fetch("/api/discount-optimization")
.then((response) => response.json())
.then((data) => {
  const tableBody = document.getElementById("discountOptimization");
  data.forEach((discount) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${discount.name}</td>
      <td class="py-2 px-4 border-b">${discount.current_stock}</td>
      <td class="py-2 px-4 border-b">${discount.suggested_discount}</td>
      <td class="py-2 px-4 border-b">${discount.reason}</td>
    `;
    tableBody.appendChild(row);
  });
});

// Fetch and render Cost Reduction Tips
fetch("/api/cost-reduction-tips")
.then((response) => response.json())
.then((data) => {
  const tableBody = document.getElementById("costReductionTips");
  data.forEach((tip) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="py-2 px-4 border-b">${tip.name}</td>
      <td class="py-2 px-4 border-b">$${tip.current_cost.toFixed(2)}</td>
      <td class="py-2 px-4 border-b">${tip.suggestion}</td>
    `;
    tableBody.appendChild(row);
  });

  // Fetch and render Promotion Planning
  fetch("/api/promotion-planning")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("promotionPlanning");
      data.forEach((promotion) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="py-2 px-4 border-b">${promotion.name}</td>
          <td class="py-2 px-4 border-b">${promotion.campaign}</td>
          <td class="py-2 px-4 border-b">${promotion.reason}</td>
        `;
        tableBody.appendChild(row);
      });
    });

  // Handle Social Media Form Submission
  const socialMediaForm = document.getElementById("socialMediaForm");
  socialMediaForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const postContent = document.getElementById("postContent").value;
    const scheduledTime = document.getElementById("scheduledTime").value;

    fetch("/api/social-media-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: postContent, scheduled_time: scheduledTime }),
    })
      .then((response) => response.json())
      .then((data) => {
        const responseDiv = document.getElementById("socialMediaResponse");
        responseDiv.innerHTML = `
          <p class="text-green-600">${data.message}</p>
          <p><strong>Content:</strong> ${data.content}</p>
        `;
      })
      .catch((error) => {
        const responseDiv = document.getElementById("socialMediaResponse");
        responseDiv.innerHTML = `<p class="text-red-600">Error: ${error.message}</p>`;
      });
  });

  // Fetch and render Loyalty Programs
  fetch("/api/loyalty-programs")
    .then((response) => response.json())
    .then((data) => {
      const programsDiv = document.getElementById("loyaltyPrograms");
      data.forEach((program) => {
        const card = document.createElement("div");
        card.className = "bg-gray-50 p-4 rounded-lg";
        card.innerHTML = `
          <h3 class="text-xl font-semibold">${program.name}</h3>
          <p class="text-gray-600">${program.description}</p>
        `;
        programsDiv.appendChild(card);
      });
    });
// Dealer Negotiation
const dealerInput = document.getElementById("dealerInput");
const dealerSend = document.getElementById("dealerSend");
const dealerResponseText = document.getElementById("dealerResponseText");

dealerSend.addEventListener("click", function () {
  const input = dealerInput.value;
  fetch("/api/chatbot/dealer-negotiation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input }),
  })
    .then((response) => response.json())
    .then((data) => {
      dealerResponseText.innerText = data.reply;
    })
    .catch((error) => console.error("Error:", error));
});

// Customer Negotiation
const customerInput = document.getElementById("customerInput");
const customerSend = document.getElementById("customerSend");
const customerResponseText = document.getElementById("customerResponseText");

customerSend.addEventListener("click", function () {
  const input = customerInput.value;
  fetch("/api/chatbot/customer-negotiation", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input }),
  })
    .then((response) => response.json())
    .then((data) => {
      customerResponseText.innerText = data.reply;
    })
    .catch((error) => console.error("Error:", error));
});

// NLP Chatbot
const nlpInput = document.getElementById("nlpInput");
const languageSelect = document.getElementById("languageSelect");
const nlpSend = document.getElementById("nlpSend");
const nlpResponseText = document.getElementById("nlpResponseText");

nlpSend.addEventListener("click", function () {
  const input = nlpInput.value;
  const language = languageSelect.value;
  fetch("/api/chatbot/nlp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: input, language: language }),
  })
    .then((response) => response.json())
    .then((data) => {
      nlpResponseText.innerText = data.reply;
    })
    .catch((error) => console.error("Error:", error));
});

});