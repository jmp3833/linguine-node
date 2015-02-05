var passport = require('passport');
var LdapStrategy = require('passport-ldapauth').Strategy;
var User = require('../models/user');


module.exports = function(app){
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new LdapStrategy({
    server: {
      url: 'ldaps://ldap.rit.edu',
      searchBase: 'ou=people,dc=rit,dc=edu',
      searchFilter: '(uid={{username}})'
    }
  },
  function(user, done){
    User.find({ dce: user.uid }).limit(1).exec(function(err, users){
      if(users.length === 0) {
        User.create({ dce: user.uid, name: user.cn }, function(err, user){
          done(null, user);
        });
      }else {
        done(null, users[0]);
      }
    });
  }));

  app.post('/api/login', passport.authenticate('ldapauth'), function(req, res) {
    res.send({user: req.user});
  });

  app.get('/api/logged_in', function(req, res){
    if(req.user) {
      res.send({loggedIn: true, user: req.user });
    }else{
      res.send({loggedIn: false});
    }
  });

  app.post('/api/logout', function(req, res){
    req.logout();
    res.send({});
  });
}
