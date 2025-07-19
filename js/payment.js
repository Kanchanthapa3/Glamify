// Load cart total (keep this if you want to show cart summary)
function loadCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    cart.forEach(item => {
        const quantity = item.quantity || 1;
        const price = parseFloat(item.price) || 0;
        subtotal += price * quantity;
    });
    const shipping = subtotal > 5000 ? 0 : (cart.length > 0 ? 100 : 0);
    const tax = subtotal * 0.13;
    const total = subtotal + shipping + tax;
    localStorage.setItem('paymentTotal', total);
}
document.addEventListener('DOMContentLoaded', function() {
    // Cash on Delivery button logic
    const codBtn = document.getElementById('cashOnDeliveryBtn');
    if (codBtn) {
        codBtn.onclick = function() {
            alert("Order placed successfully! Your Glamify goodies will be delivered soon.");
            localStorage.removeItem('cart');
        };
    }

    // Khalti Payment Integration
    const khaltiBtn = document.getElementById('khaltiPayBtn');
    if (khaltiBtn) {
        khaltiBtn.onclick = function() {
            const total = parseFloat(localStorage.getItem('paymentTotal') || '0') * 100; // Khalti uses paisa

            var config = {
                "publicKey": "test_public_key_dc74b7b7a9b14b8b8e6e7e7e7e7e7e7e",
                "productIdentity": "1234567890",
                "productName": "Glamify Order",
                "productUrl": "http://localhost:3002/product.html",
                "paymentPreference": [
                    "KHALTI",
                    "EBANKING",
                    "MOBILE_BANKING",
                    "CONNECT_IPS",
                    "SCT"
                ],
                "eventHandler": {
                    onSuccess(payload) {
                        alert("Payment successful! Thank you for shopping with Glamify.");
                        localStorage.removeItem('cart');
                        window.location.href = "payment-success.html";
                    },
                    onError(error) {
                        alert("Payment failed. Please try again.");
                        window.location.href = "payment-failed.html";
                    },
                    onClose() {}
                }
            };

            var checkout = new KhaltiCheckout(config);
            checkout.show({amount: total});
        };
    }
});