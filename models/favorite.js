module.exports = function (sequelize) {
  var Favorite = sequelize.define('Favorite', {});

  Favorite.associate = models => {
    Favorite.belongsTo(models.User);
    Favorite.belongsTo(models.MovieShow);


  }

  return Favorite;
};
