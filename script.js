// Fetch product data from the API and initialize the cart
async function fetchProducts() {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
    );
    const data = await response.json();
    const products = data.items.map((item) => ({
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }));

    // Load from Local Storage or initialize with fetched data
    const storedCart = JSON.parse(localStorage.getItem("cartData"));
    if (storedCart && storedCart.length > 0) {
      displayProducts(storedCart);
    } else {
      displayProducts(products);
      localStorage.setItem("cartData", JSON.stringify(products));
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Display products in the cart table
function displayProducts(products) {
  const itemsList = document.querySelector("#items-list tbody");
  itemsList.innerHTML = "";

  products.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>
                <img src="${product.image}" alt="${
      product.title
    }" class="product-image">
                <span>${product.title}</span>
            </td>
            <td>₹${product.price}</td>
            <td>
                <input type="number" min="1" value="${
                  product.quantity
                }" data-index="${index}" class="quantity-input">
            </td>
            <td class="subtotal">₹${(product.price * product.quantity).toFixed(
              2
            )}</td>
            <td>
                 <button class="remove-button" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    itemsList.appendChild(row);
  });

  updateCartTotal();
  attachEventListeners();
}

// Update subtotal and total prices
function updateCartTotal() {
  const subtotals = document.querySelectorAll(".subtotal");
  let total = 0;

  subtotals.forEach((subtotal) => {
    total += parseFloat(subtotal.textContent.replace("₹", ""));
  });

  document.getElementById("subtotal").textContent = total.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);
}

// Handle quantity change and remove item actions
function attachEventListeners() {
  // Quantity change event
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const index = e.target.getAttribute("data-index");
      const quantity = parseInt(e.target.value);

      if (quantity < 1) {
        alert("Quantity cannot be less than 1");
        e.target.value = 1;
        return;
      }

      const cartData = JSON.parse(localStorage.getItem("cartData"));
      cartData[index].quantity = quantity;
      localStorage.setItem("cartData", JSON.stringify(cartData));

      const price = cartData[index].price;
      const newSubtotal = price * quantity;
      document
        .querySelectorAll(".cart-table tbody tr")
        [index].querySelector(
          ".subtotal"
        ).textContent = `₹${newSubtotal.toFixed(2)}`;

      updateCartTotal();
    });
  });

  // Remove item event
  document.querySelectorAll(".remove-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      const cartData = JSON.parse(localStorage.getItem("cartData"));
      cartData.splice(index, 1);
      localStorage.setItem("cartData", JSON.stringify(cartData));

      displayProducts(cartData);
    });
  });
}

// Handle checkout button click
document.getElementById("checkout-btn").addEventListener("click", () => {
  const total = document.getElementById("total").textContent;
  if (total === "0.00") {
    alert("Your cart is empty!");
  } else {
    alert(`Checkout successful! Total: ₹${total}`);
    localStorage.removeItem("cartData");
    displayProducts([]);
  }
});

// Initialize cart by fetching products
fetchProducts();
