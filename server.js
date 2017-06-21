const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const passport = require('passport')
const flash = require('connect-flash')
const morgan       = require('morgan')
const cookieParser = require('cookie-parser')
const session      = require('express-session')

// express
app.use(express.static('public'))
app.use(morgan('dev')) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
app.use(bodyParser()) // get information from html forms

// ejs
app.set('view engine', 'ejs') // set up ejs for templating

// passport
require('./config/passport')(passport) // pass passport for configuration
app.use(session({ secret: 'iloveMurphy' })) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

// routes
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
