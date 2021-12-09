
const sequelize = require('sequelize');
const connection = new sequelize('Email','root','123456',{
    host: 'localhost',
    dialect: 'mysql',
})

module.exports = connection;