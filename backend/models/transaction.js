// models/transaction.js
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    userId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    category: DataTypes.STRING,
    desc: DataTypes.STRING,
    date: DataTypes.DATE
  });

  Transaction.associate = function(models) {
    Transaction.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Transaction;
};
