module.exports = function (sequelize) {
  var Favorite = sequelize.define('Favorite', {});

  Favorite.associate = models => {
    Favorite.belongsTo(models.User, { as: 'User' });
    Favorite.belongsTo(models.MovieShow, { as: 'MovieShow' });


  }

  return Favorite;
};
