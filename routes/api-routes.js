// Requiring our models and passport as we've configured it
var db = require('../models');
var passport = require('../config/passport');
var dotenv = require('dotenv').config();
var { MovieDb } = require('moviedb-promise');
// var moviedb = new MovieDb(process.env.movie_api_key);
var moviedb = new MovieDb(dotenv.parsed.movie_api_key);

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
    var userData = {};

    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {

      db.User.findOne({
        attributes: ['username', 'createdAt', 'id'],
        where: {
          id: req.body.id
        },
        include: [
          { model: db.User, as: 'followerId', attributes: ['username', 'createdAt', 'id']},
          { model: db.User, as: 'followingId', attributes: ['username', 'createdAt', 'id']}


        ]
      })
        .then(function(result) {
          console.log('User');
          console.log(result);
          userData = result;
          delete userData.password;
          delete userData.updatedAt;
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
        console.log('Favorites');
        console.log(result);
        userData.favorites = result;
        res.json({
          'user_data': userData
        });
      });

      // find followers
      // db.Follows.findAll({
      //   where: {
      //     followingId: req.body.id
      //   },
      //   include:
      //   [
      //     { model: db.User, as: 'Users' }
      //   ]
      // })
      //   .then(function(result) {
      //     console.log('followers');
      //     console.log(result);
      //     userData.followers = result;
      //   });


      console.log(userData);


    }
  });

  // follow a new user, userid being the person the user wants to follow
  app.post('/api/follow/:otherUser', function(req, res) {
    console.log(req.user);
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // TODO: get the user's id and use `userid` param to set who to follow
      db.Follows.create({
        followingId: req.params.otherUser,
        followerId: req.user.id
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
    } else if (db.Follows.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.followingId
      }
    }) === null) {
      res.json({'error_message' : 'Not following that user'});
    } else {
      db.Follows.destroy({
        where: {
          followingId: req.params.followingId,
          followerId: req.user.id
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
