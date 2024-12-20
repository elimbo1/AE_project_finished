const { sequelize } = require("../server");
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: DataTypes.STRING,
    role: {
        type: DataTypes.ENUM,
        values: ['user', 'tester', 'admin'],
        validate: {
            isIn: [['user', 'tester', 'admin']]
        }
    }
})

module.exports = User;