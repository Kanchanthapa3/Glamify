 // script.js

// Sample products (you can later fetch these from your Node.js backend)
const products = [
  {
    id: 1,
    name: "Matte Lipstick",
    price: 12.99,
    image: "https://i.imgur.com/HYI1syt.jpg",
  },
  {
    id: 2,
    name: "Liquid Foundation",
    price: 24.99,
    image: "https://i.imgur.com/3zC0qBu.jpg",
  },
  {
    id: 3,
    name: "Blush Palette",
    price: 19.99,
    image: "https://i.imgur.com/WKUclfn.jpg",
  },
  {
    id: 4,
    name: "Waterproof Mascara",
    price: 15.50,
    image: "https://i.imgur.com/X1EesAg.jpg",
  }
];

// Render products to the page
const productList = document.getElementById("product-list");

products.forEach(product => {
  const div = document.createElement("div");
  div.classList.add("product");
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>$${product.price}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  productList.appendChild(div);
});

// Add to Cart functionality using localStorage
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const product = products.find(p => p.id === productId);
  const existing = cart.find(p => p.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${product.name} added to cart!`);
}
