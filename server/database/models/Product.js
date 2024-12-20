const { sequelize } = require("../server");
const { DataTypes } = require('sequelize');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: {
            min: 0,
            max: 5
        }
    }
});

Product.hasMany(Review, { as: 'reviews', foreignKey: 'productId' });
Review.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { Product, Review };
