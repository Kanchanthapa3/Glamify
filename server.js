const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/glamify', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    image: String,
    status: { type: String, default: 'pending' }, // 'pending' or 'approved'
    createdBy: String, // user email
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

// In-memory storage (replace with database in production)
const users = [];
const reviews = [];

// Ensure admin user always exists in memory
const ADMIN_EMAIL = 'admin@glamify.com';
const ADMIN_PASSWORD = 'admin123'; // You can change this
if (!users.find(u => u.email === ADMIN_EMAIL)) {
    users.push({ name: 'Admin', email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Admin middleware
const isAdmin = (req, res, next) => {
    if (req.user && req.user.email === ADMIN_EMAIL) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;

    // Check if user already exists
    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Store user (in production, hash the password)
    users.push({ name, email, password });
    res.status(201).json({ message: 'Registration successful' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
});

app.post('/api/reviews', authenticateToken, (req, res) => {
    const { productId, rating, title, review } = req.body;
    const userEmail = req.user.email;

    reviews.push({
        productId,
        rating,
        title,
        review,
        userEmail,
        date: new Date(),
    });

    res.status(201).json({ message: 'Review submitted successfully' });
});

app.get('/api/reviews', (req, res) => {
    res.json(reviews);
});

// Product Management APIs
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, price, category, image } = req.body;
        const product = new Product({
            name,
            price: parseFloat(price),
            category,
            image,
            createdBy: req.user.email
        });
        await product.save();
        res.status(201).json({ message: 'Product submitted for approval' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating product' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        let products;
        if (req.user.email === ADMIN_EMAIL) {
            products = await Product.find().sort({ createdAt: -1 });
        } else {
            products = await Product.find({ status: 'approved' }).sort({ createdAt: -1 });
        }
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});

app.patch('/api/products/:id/approve', authenticateToken, isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, { status: 'approved' });
        res.json({ message: 'Product approved' });
    } catch (error) {
        res.status(500).json({ message: 'Error approving product' });
    }
});

app.delete('/api/products/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

function onPaymentError(error) {
    showPopup("Oops! Something went wrong with your payment. Please try again or use another method.");
}