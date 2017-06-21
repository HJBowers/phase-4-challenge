const LocalStrategy    = require('passport-local').Strategy
const configDB = require('./database.js')
const Sequelize = require('sequelize')
const pg = require('pg').native
const pghstore = require('pg-hstore')
const sequelize = new Sequelize(configDB.url)
const User = sequelize.import('../app/user')

User.sync()

// var configAuth = require('./auth') // use this one for testing

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user){
			done(null, user)
		}).catch(function(err){
			done(err, false)
		})
  })

  passport.use('local-signIn', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // able to check if a user is logged in or not
    },
    function(req, email, password, done) {
			User.findOne({ where: { localemail: email }})
			.then(function(user) {
				if (!user) {
					done(null, false, req.flash('loginMessage', 'Unknown user'))
				} else if (!user.validPassword(password)) {
					done(null, false, req.flash('loginMessage', 'Wrong password'))
				} else {
					done(null, user)
				}
			}).catch(function(err) {
				done(null, false, req.flash('loginMessage',err.name + " " + err.message))
			})
	  }
  ))

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
    },
    function(req, email, password, done) {
  		User.findOne({ where: { localemail: email }})
			.then(function(existingUser) {
				if (existingUser)
					return done(null, false, req.flash('loginMessage', 'That email is already taken.'))
				if(req.user) {
					var user = req.user
					user.localemail = email
					user.localpassword = User.generateHash(password)
					user.save().catch(function (err) {
						throw err
					}).then (function() {
						done(null, user)
					})
				} else {
					var newUser = User.build ({localemail: email, localpassword: User.generateHash(password)})
					newUser.save().then(function() {done (null, newUser)}).catch(function(err) { done(null, false, req.flash('loginMessage', err))})
				}
			})
			.catch(function (err) {
				done(null, false, req.flash('loginMessage',err.name + " " + err.message))
			})
    }
  ))

}
