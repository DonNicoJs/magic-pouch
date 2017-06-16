'use strict';
module.exports = function(sequelize, DataTypes) {
  const why = sequelize.define('why', {
    content: DataTypes.TEXT,
    type: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        why.belongsTo(models.daily_task);
        why.belongsTo(models.weekly_task);
      }
    }
  });
  return why;
};
