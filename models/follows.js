module.exports = function (sequelize) {
  var Follows = sequelize.define('Follows', {
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      }
    }
  });
  Follows.associate = function(models) {
    Follows.belongsTo(models.User, { foreignKey: 'id', as: 'followerId'} );
    Follows.belongsTo(models.User, { foreignKey: 'id', as: 'followingId'});
  };

  return Follows;
};
