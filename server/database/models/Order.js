const { sequelize } = require("../server");
const { DataTypes } = require('sequelize');
const { Product } = require('./Product'); // Import the Product model

// Define the Order model
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});

// Define the OrderProduct model for many-to-many relationship
const OrderProduct = sequelize.define('OrderProduct', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

// Relationships
Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', as: 'products' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId', as: 'orders' });

module.exports = { Order, OrderProduct };