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

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(productId) {
    cart.push(productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart');
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// Notification system
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 2000);
    }, 100);
}

// Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token && window.location.pathname !== '/login.html' && window.location.pathname !== '/register.html') {
        window.location.href = '/login.html';
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Slider functionality
function initSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Show first slide
    slides[0].classList.add('active');
    
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Auto advance slides every 5 seconds
    let slideInterval = setInterval(nextSlide, 5000);
    
    // Pause on hover
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });
    }
}

// Initialize slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initSlider();
});
