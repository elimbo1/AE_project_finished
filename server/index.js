const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const reviewRoutes = require('./routes/review.routes');
const orderRoutes = require('./routes/order.routes');
const { verifyToken } = require('./utils');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' })
})

app.use(morgan('dev'));

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use('/users', verifyToken, userRoutes);
app.use('/product', verifyToken, productRoutes);
app.use('/category', verifyToken, categoryRoutes);
app.use('/review', verifyToken, reviewRoutes);
app.use('/order', verifyToken, orderRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}`)
})