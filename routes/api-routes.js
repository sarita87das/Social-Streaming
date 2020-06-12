// Requiring our models and passport as we've configured it
var db = require('../models');
var passport = require('../config/passport');

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/members');
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/signup', function(req, res) {

    db.User.create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country
    })
    .then(function() {
      res.status(200).json({'status':'success'});
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
  app.post('/api/user_data', function(req, res) {
    console.log(req.body);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      let userData = {};
      let favs = {};
      let following = {};
      let followers = {};

      // get data
      // db.User.findOne({
      //   where: {
      //     id: req.body.id
      //   }
      // }, {
      //   include: [{
      //     model: db.Favorite
      //   }]
      // })
      // .then(function(result) {
      //   userData = result;
      //   delete userData[id];
      //   delete userData[createdAt];
      //   delete userData[updatedAt];
      //   delete userData[password];
      // });
      // find faves
      db.Favorite.findAll({
        where: {
          UserId: req.body.id
        },
        include: [
          { model: db.User},
          { model: db.MovieShow}
        ]
      }).then(function(result) {
        console.log(result);


      });

      // find followers

      // find following

      res.json({
        username: req.user.username,
        id: req.user.id
      });
    }
  });

  // follow a new user, userid being the person the user wants to follow
  app.post('/api/follow/:otherUser', function(req, res) {

    // TODO: https://stackoverflow.com/questions/7042340/error-cant-set-headers-after-they-are-sent-to-the-client#7789131
    console.log(req.user);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // TODO: get the user's id and use `userid` param to set who to follow
      db.Follow.create({
        followingId: req.params.otherUser,
        UserId: req.user.id
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

  app.post('/api/unfollow/:followingId', function(req, res) {
    console.log(req.user.id);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else if (db.Follow.findOne({
      where: {
        userId: req.user.id,
        followingId: req.params.followingId
      }
    }) === null) {
      res.json({'error_message' : 'Not following that user'});
    } else {
      db.Follow.destroy({
        where: {
          followingId: req.params.followingId,
          userId: req.user.id
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
      db.MovieShow.findOne({
        where: {
          title: req.body.title
        }
      })
      .then(function(result) {
        if(result !== null) {
          res.json({'error_message' : 'Media already exists'});
        } else {
          db.MovieShow.create({
            title: req.body.title
          });
          res.json({status: 'success',
          title: req.body.title}).status(200);
        }
      });
    }
  });

  app.post('/api/favorite/:mediaId', function(req, res) {
    console.log(req.user.id);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      db.Favorite.findOne({
        where: {
          userId: req.user.id,
          movieShowId: req.params.mediaId
        }
      }).then(function(result) {
        console.log('result');
        console.log(result);
        if(result !== null) {
          res.json({'error_message': 'Media already favorited by user'});
        } else {
          console.log(req);
          db.Favorite.create({
            UserId: req.user.id,
            MovieShowId: req.params.mediaId
          })
            .then(function(result) {
              console.log(result);
              res.json({
                'status': 'success',
                'title': req.body.title
              });
            });

        }
      });
    }
  });

  app.post('/api/unfavorite/:mediaId', function(req, res) {
    console.log(req.user.id);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // TODO: destroy the follow obj where the user's id and followed user's id match
      db.Favorite.destroy({
        where: {
          userId: req.user.id,
          movieShowId: req.params.mediaId
        }
      });

      // TODO: change this, discuss with team
      res.json({
        title: req.body.title
      });
    }
  });

};
