// Product Data
const products = [
    {
        id: 1,
        name: "Radiant Glow Foundation",
        price: 2500,
        category: "Face",
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Achieve a natural, luminous finish with our lightweight foundation"
    },
    {
        id: 2,
        name: "Velvet Matte Lipstick",
        price: 1200,
        category: "Lips",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Long-lasting, creamy matte lipstick in stunning shades"
    },
    {
        id: 3,
        name: "Shimmer Eyeshadow Palette",
        price: 3500,
        category: "Eyes",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "18 stunning shades for endless eye looks"
    },
    {
        id: 4,
        name: "Pro Brush Collection",
        price: 4500,
        category: "Tools",
        image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Professional-grade makeup brushes for flawless application"
    },
    {
        id: 5,
        name: "Hydrating Facial Mist",
        price: 1800,
        category: "Skincare",
        image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Refreshing rose water mist for instant hydration"
    },
    {
        id: 6,
        name: "Volume Boost Mascara",
        price: 1500,
        category: "Eyes",
        image: "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        description: "Dramatic volume and length for your lashes"
    }
];

// Category Data
const categories = [
    {
        name: "Face",
        image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Lips",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Eyes",
        image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        name: "Skincare",
        image: "https://images.unsplash.com/photo-1525904097878-94fb15835963?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    
    cartCount.textContent = cart.length;
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <p>NPR ${item.price}</p>
                    <button onclick="removeFromCart(${item.id})" class="remove-item">Remove</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.innerHTML = `<strong>Total: NPR ${total}</strong>`;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCart();
        showNotification('Added to cart!');
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCart();
        showNotification('Removed from cart!');
    }
}

// Display products
function displayProducts(productsToShow = products) {
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        productsGrid.innerHTML = productsToShow.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="product-price">NPR ${product.price}</p>
                    <button onclick="addToCart(${product.id})" class="add-to-cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Display categories
function displayCategories() {
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
        categoryGrid.innerHTML = categories.map(category => `
            <div class="category-card" onclick="filterByCategory('${category.name}')">
                <img src="${category.image}" alt="${category.name}">
                <div class="category-name">${category.name}</div>
            </div>
        `).join('');
    }
}

// Filter products by category
function filterByCategory(category) {
    const filtered = products.filter(product => product.category === category);
    displayProducts(filtered);
}

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
            displayProducts(filtered);
        });
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

// Cart modal toggle
function setupCartModal() {
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.querySelector('.cart-modal');
    
    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', () => {
            cartModal.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!cartModal.contains(e.target) && !cartIcon.contains(e.target)) {
                cartModal.classList.remove('active');
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    displayCategories();
    setupSearch();
    setupCartModal();
    updateCart();
}); 