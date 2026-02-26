const {Sequelize} = require('sequelize')
const db = require('../database')

const Customer = db.define('customer', {
   customer_id: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    fname: {
        type: Sequelize.STRING,
        
    },
    lname: {
        type: Sequelize.STRING,
      
    },
    address: {
        type: Sequelize.STRING,
        
    },
},
    {
  freezeTableName: true,
  timestamps: false  

})

module.exports = Customer;