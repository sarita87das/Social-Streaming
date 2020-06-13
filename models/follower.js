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
