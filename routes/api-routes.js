// Requiring our models and passport as we've configured it
var db = require('../models');
var passport = require('../config/passport');
const movie_api_key = 'df49692537d122e8f2ad0279c16b2715';
var dotenv = require('dotenv').config();
var { MovieDb } = require('moviedb-promise');
// var moviedb = new MovieDb(process.env.movie_api_key);
var moviedb = new MovieDb(movie_api_key);

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
  /*app.post('/api/user_data', function(req, res) {
    var userData = {};

    console.log(req.body);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {

      db.Favorite.findOne({
        where: {
          id: req.body.id
        }
      })
        .then(function(result) {
          userData = result;
          delete userData.password;
          delete userDat.updatedAt;
        });

      db.Favorite.findAll({
        where: {
          UserId: req.body.id
        },
        include: [
          // { model: db.User, as: 'User' },
          { model: db.MovieShow, as: 'MovieShow' }
        ]
      }).then(function(result) {
        userData.favorites = result;
      });

      // find followers
      db.Follow.findAll({
        where: {
          UserId: req.body.id
        },
        include:
        [
          { model: db.User, as: 'Following' }
        ]
      })
        .then(function(result) {
          userData.followers = result;
        });

      res.json({
        'user_data': userData
      });
    }
  });*/

  // follow a new user, userid being the person the user wants to follow
  app.post('/api/follow/:otherUser', function(req, res) {
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

  // get top 10 by id in our db
  app.get('/api/moviedetails/id/:mediaId', function(req, res) {
    db.MovieShow.findOne({
      where: {
        id: req.params.mediaId
      }
    })
      .then(function(result) {
        console.log(result);
        moviedb.searchMovie({ query: result.title }).then(data => {
          console.log(data);
          // get the results array w/ first 10 results
          data = data.results.slice(0, 10);

          res.json({'results': data});

        }).catch(console.error)
      });
  });

  // get the top 10 by title
  app.get('/api/moviedetails/title/:title', function(req, res) {
    moviedb.searchMovie({ query: req.params.title }).then(data => {
      console.log(data);
      // get the results array w/ first 10 results
      data = data.results.slice(0, 10);

      res.json({'results': data});

  }).catch(console.error)

  });

  // get top 10 trending for the week
  app.get('/api/moviedetails/topten', function(req, res) {
    moviedb.trending({'media_type': 'all', 'time_window': 'week'}).then(data => {
      console.log(data);
      data = data.results.slice(0, 10);

      res.json({'results': data});
    });
  });

}
