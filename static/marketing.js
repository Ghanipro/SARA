document.addEventListener("DOMContentLoaded", function () {
    // Fetch and render Promotion Planning
    fetch("/api/promotion-planning")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("promotionPlanning");
        tableBody.innerHTML = data
          .map(
            (promotion) => `
              <tr class="hover:bg-blue-50 transition duration-200">
                <td class="py-3 px-4 border-b">${promotion.name}</td>
                <td class="py-3 px-4 border-b">${promotion.campaign}</td>
                <td class="py-3 px-4 border-b">${promotion.reason}</td>
              </tr>
            `
          )
          .join("");
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
        programsDiv.innerHTML = data
          .map(
            (program) => `
              <div class="bg-blue-50 p-4 rounded-lg">
                <h3 class="text-xl font-semibold text-blue-800">${program.name}</h3>
                <p class="text-gray-600">${program.description}</p>
              </div>
            `
          )
          .join("");
      });
  });