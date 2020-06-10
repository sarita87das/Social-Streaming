module.exports = function (sequelize) {
  var Favorite = sequelize.define('Favorite', {});

  // Favorite.associate = function (models) {
  //   // We're saying that a favorite tv show or movie should belong to a user
  //   //
  //   Favorite.belongsToMany(models.User);
  //   Favorite.belongsToMany(models.MovieShow);
  // };

  return Favorite;
};
