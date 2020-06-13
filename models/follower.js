<<<<<<< HEAD
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
=======
module.exports = function (sequelize) {
  var Follow = sequelize.define('Follow', {
    // followingId: { , DataTypes
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   validate: {
    //     len: [1]
    //   }
    // }
  });
  Follow.associate = function(models) {
    // Follow.hasOne(models.User, { as: 'follower'} );
    // Follow.hasOne(models.User, { as: 'following'} );

  };

  return Follow;
};
>>>>>>> 919a352809f68042befc19107c819f4389b74dd0
