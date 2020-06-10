module.exports = function (sequelize, DataTypes) {
    var Follow = sequelize.define('Follow', {
      followingId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: [1]
        }
      }
    });
  
    return Follow;
  };