const {Sequelize} = require('sequelize')

const db = require("../database");

const Product = db.define('product', {
    id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    product_name: {
        type: Sequelize.TEXT,
        
    },
    product_category: {
        type: Sequelize.TEXT,
      
    },
    price: {
        type: Sequelize.MEDIUMINT,
        
    },
    quantity: {
        type: Sequelize.MEDIUMINT,

    },
    description: {
        type: Sequelize.TEXT,
    },
    image_url: {
        type: Sequelize.TEXT,
    }
},
    {
  freezeTableName: true,
  timestamps: false  
});

module.exports = Product;