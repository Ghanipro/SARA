document.addEventListener("DOMContentLoaded", function () {
  const toggleFormButton = document.getElementById("toggleFormButton");
  const productFormContainer = document.getElementById("productFormContainer");
  const productForm = document.getElementById("productForm");
  const cancelFormButton = document.getElementById("cancelFormButton");
  const productList = document.getElementById("productList");

  let products = []; // Array to store products
  let isEditing = false; // Flag to track if we're editing a product

  // Toggle Form Visibility
  toggleFormButton.addEventListener("click", function () {
    productFormContainer.classList.toggle("hidden");
    if (!isEditing) {
      productForm.reset(); // Reset form if not editing
    }
  });

  // Cancel Form
  cancelFormButton.addEventListener("click", function () {
    productFormContainer.classList.add("hidden");
    productForm.reset();
    isEditing = false;
  });

  // Handle Form Submission
  productForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const productId = document.getElementById("productId").value;
    const name = document.getElementById("name").value;
    const category = document.getElementById("category").value;
    const stock = parseInt(document.getElementById("stock").value);
    const price = parseFloat(document.getElementById("price").value);
    const cost = parseFloat(document.getElementById("cost").value);
    const leadTime = parseInt(document.getElementById("lead_time").value);

    const product = {
      id: productId || Date.now().toString(), // Use timestamp as ID for new products
      name,
      category,
      stock,
      price,
      cost,
      leadTime,
    };

    if (isEditing) {
      // Update existing product
      const index = products.findIndex((p) => p.id === productId);
      products[index] = product;
    } else {
      // Add new product
      products.push(product);
    }

    renderProductList();
    productFormContainer.classList.add("hidden");
    productForm.reset();
    isEditing = false;
  });

  // Render Product List
  function renderProductList() {
    productList.innerHTML = products
      .map(
        (product) => `
          <tr>
            <td class="py-3 px-4 border-b">${product.name}</td>
            <td class="py-3 px-4 border-b">${product.category}</td>
            <td class="py-3 px-4 border-b">${product.stock}</td>
            <td class="py-3 px-4 border-b">$${product.price.toFixed(2)}</td>
            <td class="py-3 px-4 border-b">$${product.cost.toFixed(2)}</td>
            <td class="py-3 px-4 border-b">${product.leadTime} days</td>
            <td class="py-3 px-4 border-b">
              <button onclick="editProduct('${product.id}')" class="text-blue-500 hover:text-blue-700">Edit</button>
              <button onclick="deleteProduct('${product.id}')" class="text-red-500 hover:text-red-700 ml-2">Delete</button>
            </td>
          </tr>
        `
      )
      .join("");
  }

  // Edit Product
  window.editProduct = function (id) {
    const product = products.find((p) => p.id === id);
    if (product) {
      document.getElementById("productId").value = product.id;
      document.getElementById("name").value = product.name;
      document.getElementById("category").value = product.category;
      document.getElementById("stock").value = product.stock;
      document.getElementById("price").value = product.price;
      document.getElementById("cost").value = product.cost;
      document.getElementById("lead_time").value = product.leadTime;

      productFormContainer.classList.remove("hidden");
      isEditing = true;
    }
  };

  // Delete Product
  window.deleteProduct = function (id) {
    products = products.filter((p) => p.id !== id);
    renderProductList();
  };

  // Initial fetch
  fetchProducts();
});