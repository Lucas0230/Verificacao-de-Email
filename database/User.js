
const sequelize = require('sequelize');
const connection = require('./database');

const User = connection.define('users', {

    username: {
        type: sequelize.STRING,
        allowNull: false
    },

    email: {
        type: sequelize.STRING,
        allowNull:false
    }
    ,
    password: {
        type: sequelize.STRING,
        allowNull: false
    },
    verified: {
        type: sequelize.BOOLEAN,
        defaultValue: false
    }

})


module.exports = User;