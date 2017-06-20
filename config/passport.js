const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const User = require('../app/user')

module.exports = function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user)
    })
  })

  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true
  },


// SignUp
  function(req, email, password, done) {
      process.nextTick(function() { // deals with async
        User.getUserByEmail({ 'local.email' :  email }, function(err, user) {
          if (err)
            return done(err)
          if (user) {
            return done(null, false, req.flash('signUpMessage', 'That email is already taken.'))
          } else {
            const newUser = new User()
            newUser.local.email = email
            newUser.local.password = newUser.generateHash(password)
            newUser.save(function(err) {
              if(err) {
                throw err
              }
              return done(null, newUser)
            })
          }
        })
      })
    }
  ))
}

// ===============================================================
// ===============================================================
// ===============================================================
// const knex = require('../db/connection')
// const LocalStrategy = require('passport-local').Strategy
// const options = {}

// module.exports = () => {
//
//   passport.serializeUser((user, done) => {
//     done(null, user.id)
//   })
//
//   passport.deserializeUser((id, done) => {
//     knex('users').where({id}).first()
//     .then((user) => { done(null, user) })
//     .catch((err) => { done(err,null) })
//   })
//
//   function comparePass(userPassword, databasePassword) {
//     return bcrypt.compareSync(userPassword, databasePassword);
//   }
//
//   function createUser (req) {
//     const salt = bcrypt.genSaltSync();
//     const hash = bcrypt.hashSync(req.body.password, salt);
//     return knex('users')
//     .insert({
//       username: req.body.username,
//       password: hash
//     })
//     .returning('*');
//   }
//
//   passport.use(new LocalStrategy(options, (username, password, done) => {
//     // check to see if the username exists
//     knex('users').where({ username }).first()
//     .then((user) => {
//       if (!user) return done(null, false)
//       if (!comparePass(password, user.password)) {
//         return done(null, false)
//       } else {
//         return done(null, user)
//       }
//     })
//     .catch((err) => { return done(err) })
//   }))
//
//
//
// }
//
// module.exports = passport

// ===============================================================
// ===============================================================
// ===============================================================

// const LocalStrategy   = require('passport-local').Strategy
// const mysql = require('mysql')
// const connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : ''
// })
//
// connection.query('USE vidyawxx_build2')
//
// module.exports = function(passport) {
//   passport.serializeUser(function(user, done) {
// 		done(null, user.id)
//   })
//
//   passport.deserializeUser(function(id, done) {
// 		connection.query("select * from users where id = "+id,function(err,rows){
// 			done(err, rows[0])
// 		})
//   })
//
//   passport.use('local-signup', new LocalStrategy(
//     {
//       usernameField : 'email',
//       passwordField : 'password',
//       passReqToCallback : true
//     },
//     (req, email, password, done) => {
//       connection.query("select * from users where email = '"+email+"'", (err,rows) => {
//     		if(err)
//           return done(err)
//   		  if(rows.length) {
//           return done(null, false, req.flash('signupMessage', 'That email is already taken.'))
//         }else{
//           const newUserMysql = new Object()
//   			  newUserMysql.email = email
//           newUserMysql.password = password
//   			  const insertQuery = "INSERT INTO users ( email, password ) values ('" + email +"','"+ password +"')"
//   			  connection.query(insertQuery, (err,rows) => {
//   			    newUserMysql.id = rows.insertId
//             return done(null, newUserMysql)
//   			  })
//         }
//   		})
//     }
//   ))
//
//   passport.use('local-login', new LocalStrategy(
//     {
//       usernameField : 'email',
//       passwordField : 'password',
//       passReqToCallback : true
//     },
//     (req, email, password, done) => {
//       connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'", (err,rows) => {
//   		  if (err)
//           return done(err)
//         if (!rows.length) {
//           return done(null, false, req.flash('loginMessage', 'No user found.'))
//         }
//         if (!( rows[0].password == password)) {
//           return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
//         }
//         return done(null, rows[0])
//   	  })
//     }
//   ))
// }
