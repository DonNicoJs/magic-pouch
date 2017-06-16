'use strict';
module.exports = function(sequelize, DataTypes) {
  const daily_task = sequelize.define('daily_task', {
    fears: DataTypes.INTEGER,
    silence_time: DataTypes.INTEGER,
    gratitude_diary: DataTypes.TEXT,
    missed_duties: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function (models) {
        daily_task.belongsTo(models.Users);
        daily_task.hasMany(models.why);
      }
    }
  });
  return daily_task;
};
