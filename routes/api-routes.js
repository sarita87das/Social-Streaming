// Requiring our models and passport as we've configured it
var db = require('../models');
var passport = require('../config/passport');

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      username: req.user.username,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/signup', function(req, res) {
    console.log('howdy');
    db.User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country
    })
      .then(function() {
        console.log('hey');
        res.redirect(307, '/api/login');
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Route for getting some data about our user to be used client side
  // used to populate the user's profile page
  app.get('/api/user_data', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });

  // follow a new user, userid being the person the user wants to follow
  app.post('/api/follow/:otherUser', function(req, res) {
    console.log(req.user.userId);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // TODO: get the user's id and use `userid` param to set who to follow
      db.Follow.create({
        followingId: req.params.otherUser,
        // userId: req.user
      });

      // Otherwise send back the user's username and id
      // Sending back a password, even a hashed password, isn't a good idea
      // TODO: change this, discuss with team
      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });

  app.delete('/api/unfollow/:followingId', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else if (db.Follow.findAll({
      where: {
        userId: req.user.userId,
        followingId: req.params.followingId
      }
    }) === null) {
      res.json({'error_message' : 'Not following that user'});
    } else {
      db.Follow.destroy({
        where: {
          followingId: req.params.followingId,
          userId: req.user.userId
        }
      });
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      // TODO: change this, discuss with team
      res.json({
        username: req.user.username,
        id: req.user.userId
      });
    }
  });

  app.post('/api/new-media', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      if (db.movieShow.findAll({
        where: {
          title: req.body.title
        }
      }) === null ) {
        res.json({'error_message' : 'Media already exists'});
      } else {
        db.MovieShow.create({
          title: req.body.title
        });
      }
      // TODO: create a new movie/show only if it cannot be found first!

      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      // TODO: change this, discuss with team
      res.json({
        title: req.body.title
      });
    }
  });

  app.post('/api/new-favorite/:mediaId', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      if (db.Favorite.findAll({
        where: {
          userId: req.user.userId,
          movieShowId: req.params.mediaId
        }
      }) === null ) {
        res.json({'error_message': 'Media already favorited by user'});
      } else {
        db.Favorite.create({
          userId: req.user.userId,
          movieShowId: req.params.mediaId
        });
      }

      // TODO: change this, discuss with team
      res.json({
        title: req.body.title
      });
    }
  });

  app.get('/api/delete-favorite/:mediaId', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // TODO: destroy the follow obj where the user's id and followed user's id match
      db.Favorite.destroy({
        where: {
          userId: req.user.userId,
          movieShowId: req.params.mediaId
        }
      });
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      // TODO: change this, discuss with team
      res.json({
        title: req.body.title
      });
    }
  });

};
