<<<<<<< HEAD
module.exports = function (sequelize) {
  var Favorite = sequelize.define('Favorite', {});

  return Favorite;
};
=======
module.exports = function (sequelize) {
  var Favorite = sequelize.define('Favorite', {});

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User, { as: 'User' });
    Favorite.belongsTo(models.MovieShow, { as: 'MovieShow' });
  };

  return Favorite;
};
>>>>>>> 919a352809f68042befc19107c819f4389b74dd0
