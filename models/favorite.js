module.exports = function (sequelize) {
  var Favorite = sequelize.define('Favorite', {});

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User, { as: 'User' });
    Favorite.belongsTo(models.MovieShow, { as: 'MovieShow' });
  };

  return Favorite;
};
