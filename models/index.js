const Customer = require("./Customer");
const CustomerAuth = require("./CustomerAuth");

Customer.hasOne(CustomerAuth, {
  foreignKey: "customer_uuid",
  sourceKey: "customer_id",
});
CustomerAuth.belongsTo(Customer, {
  foreignKey: "customer_uuid",
  targetKey: "customer_id",
});

module.exports = { Customer, CustomerAuth };
