const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Secret key for JWT
const JWT_SECRET = 'your-secret-key'; // In production, use an environment variable

// In-memory storage (replace with a database in production)
const users = [];
const reviews = [];

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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); 