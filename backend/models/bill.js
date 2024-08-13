// models/bill.js
module.exports = (sequelize, DataTypes) => {
  const Bill = sequelize.define('Bill', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    toWhom: DataTypes.STRING,
    dueDate: DataTypes.DATE
  });

  Bill.associate = function(models) {
    Bill.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Bill;
};
