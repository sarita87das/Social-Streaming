module.exports = function (sequelize) {
  var Favorite = sequelize.define('Favorite', {});

  return Favorite;
};