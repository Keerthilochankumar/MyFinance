// models/saving.js
module.exports = (sequelize, DataTypes) => {
  const Saving = sequelize.define('Saving', {
    userId: DataTypes.INTEGER,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    desc: DataTypes.STRING,
    date: DataTypes.DATE
  });

  Saving.associate = function(models) {
    Saving.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Saving;
};
