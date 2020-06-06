module.exports = function (sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorites", {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    movieShowId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
  });

  Favorite.associate = function (models) {
    // We're saying that a favorite tv show or movie should belong to a user
    // 
    Favorite.belongsToMany(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
    Favorite.belongsToMany(models.MovieShow, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Favorite;
};

