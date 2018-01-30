'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'This username is already in use',
        fields: [sequelize.fn('lower', sequelize.col('username'))]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'This email is already in use',
        fields: [sequelize.fn('lower', sequelize.col('email'))]
      }
    },
    password: DataTypes.STRING,
    type: DataTypes.ENUM('user', 'admin'),
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    activated: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: models => {}
    }
  });
  return Users;
};
