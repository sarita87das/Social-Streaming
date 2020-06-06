  module.exports = function (sequelize, DataTypes) {
    var MovieShow = sequelize.define("MovieShow", {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
      service: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1]
        }
      },
    });
  
    MovieShow.associate = function (models) {
      // We're saying that a favorite tv show or movie should belong to a user
      // 
      MovieShow.hasMany(models.Favorite, {
        foreignKey: {
          allowNull: false
        }
      });
    };
  
    return MovieShow;
  };
  
  
  