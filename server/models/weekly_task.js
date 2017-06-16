'use strict';
module.exports = function (sequelize, DataTypes) {
  const weekly_task = sequelize.define('weekly_task', {
    nature_walk: DataTypes.INTEGER,
    availability: DataTypes.INTEGER,
    behaviour: DataTypes.INTEGER,
  }, {
    classMethods: {
      associate: (models) => {
        weekly_task.belongsTo(models.Users);
        weekly_task.hasMany(models.why);
      }
    }
  });
  return weekly_task;
};
