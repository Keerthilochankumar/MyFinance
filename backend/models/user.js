// models/user.js
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING
  });

  User.associate = function(models) {
    User.hasMany(models.Bill, { foreignKey: 'userId' });
    User.hasMany(models.Saving, { foreignKey: 'userId' });
    User.hasMany(models.Transaction, { foreignKey: 'userId' });
  };

  return User;
};
