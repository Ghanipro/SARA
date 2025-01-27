document.addEventListener("DOMContentLoaded", function () {
    // Fetch and render Pricing Strategies
    fetch("/api/pricing-strategies")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("pricingStrategies");
        tableBody.innerHTML = data
          .map(
            (strategy) => `
              <tr class="hover:bg-blue-50 transition duration-200">
                <td class="py-3 px-4 border-b">${strategy.name}</td>
                <td class="py-3 px-4 border-b">$${strategy.current_price.toFixed(2)}</td>
                <td class="py-3 px-4 border-b">$${strategy.suggested_price.toFixed(2)}</td>
                <td class="py-3 px-4 border-b">${strategy.reason}</td>
              </tr>
            `
          )
          .join("");
      });
  
    // Fetch and render Discount Optimization
    fetch("/api/discount-optimization")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("discountOptimization");
        tableBody.innerHTML = data
          .map(
            (discount) => `
              <tr class="hover:bg-blue-50 transition duration-200">
                <td class="py-3 px-4 border-b">${discount.name}</td>
                <td class="py-3 px-4 border-b">${discount.current_stock}</td>
                <td class="py-3 px-4 border-b">${discount.suggested_discount}</td>
                <td class="py-3 px-4 border-b">${discount.reason}</td>
              </tr>
            `
          )
          .join("");
      });
  
    // Fetch and render Cost Reduction Tips
    fetch("/api/cost-reduction-tips")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("costReductionTips");
        tableBody.innerHTML = data
          .map(
            (tip) => `
              <tr class="hover:bg-blue-50 transition duration-200">
                <td class="py-3 px-4 border-b">${tip.name}</td>
                <td class="py-3 px-4 border-b">$${tip.current_cost.toFixed(2)}</td>
                <td class="py-3 px-4 border-b">${tip.suggestion}</td>
              </tr>
            `
          )
          .join("");
      });
  });