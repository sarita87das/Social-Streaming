// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
var bcrypt = require('bcryptjs');
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    // The email cannot be null, and must be a proper email before creation
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    validate: {
      checkLoc() {
        if(this.country === null && this.province !== null || this.city !== null)
          throw new Error('Cannot select City or State unless Country is selected!');
        if(this.province === null && this.city !== null)
          throw new Error('Cannot select City unless State is selected');
    }
  }
});
    User.associate = function (models) {
      // We're saying that a favorite tv show or movie should belong to a user
      //
      User.hasMany(models.favorites, {
        foreignKey: {
          allowNull: false
        }
      });
    };
    return movieShow;
  };


  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook('beforeCreate', function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
