'use strict';
module.exports = function (sequelize, DataTypes) {
  const monthly_task = sequelize.define('monthly_task', {
    satisfaction: DataTypes.INTEGER,
    satisfaction_amount: DataTypes.INTEGER,
    proposal: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        monthly_task.belongsTo(models.Users);
      }
    }
  });
  return monthly_task;
};
