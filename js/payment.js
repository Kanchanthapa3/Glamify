// Payment method selection
const paymentMethods = document.querySelectorAll('.payment-method');
paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
        paymentMethods.forEach(m => m.classList.remove('active'));
        method.classList.add('active');
    });
});

// Card number formatting
const cardNumber = document.getElementById('cardNumber');
cardNumber.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    e.target.value = formattedValue;
});

// Expiry date formatting
const expiryDate = document.getElementById('expiryDate');
expiryDate.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    e.target.value = value;
});

// Form submission
const paymentForm = document.getElementById('paymentForm');
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically send the payment information to your backend
    alert('Payment processed successfully!');
    window.location.href = 'dashboard.html';
});

// Load cart total
function loadCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    // Calculate subtotal from cart items
    cart.forEach(item => {
        subtotal += item.price * (item.quantity || 1);
    });
    
    // Shipping cost
    const shipping = cart.length > 0 ? 100 : 0;
    
    // Calculate total (subtotal + shipping)
    const total = subtotal + shipping;
    
    // Update the summary section
    document.querySelector('.summary-item:nth-child(1) span:last-child').textContent = `NPR ${subtotal}`;
    document.querySelector('.summary-item:nth-child(2) span:last-child').textContent = `NPR ${shipping}`;
    document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = `NPR 0`;
    document.querySelector('.summary-total span:last-child').textContent = `NPR ${total}`;

    // Store total for payment processing
    localStorage.setItem('paymentTotal', total);

    // Optionally, show a message if cart is empty
    if (cart.length === 0) {
        document.querySelector('.order-summary').insertAdjacentHTML('beforeend', '<div style="color:#ff4f7b;margin-top:1rem;">Your cart is empty. Please add items to your cart.</div>');
    }
}

// Khalti Payment Integration
function initiateKhalti() {
    const total = localStorage.getItem('paymentTotal');
    const config = {
        publicKey: 'YOUR_KHALTI_PUBLIC_KEY', // Replace with your Khalti public key
        productIdentity: 'Glamify-' + Date.now(),
        productName: 'Glamify Beauty Products',
        productUrl: window.location.href,
        eventHandler: {
            onSuccess: function(payload) {
                console.log('Khalti payment successful:', payload);
                window.location.href = '/payment-success.html';
            },
            onError: function(error) {
                console.error('Khalti payment failed:', error);
                alert('Payment failed. Please try again.');
            },
            onClose: function() {
                console.log('Khalti payment window closed');
            }
        }
    };

    // Initialize Khalti payment
    if (typeof KhaltiCheckout !== 'undefined') {
        const checkout = new KhaltiCheckout(config);
        checkout.show({ amount: total * 100 }); // Khalti expects amount in paisa
    } else {
        alert('Khalti payment system is not available. Please try again later.');
    }
}

// Load initial cart total
loadCartTotal(); 