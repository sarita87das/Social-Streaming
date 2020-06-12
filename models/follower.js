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

  return Follow;
};
