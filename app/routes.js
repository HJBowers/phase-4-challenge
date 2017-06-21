const queries = require('../config/queries')

module.exports = function(app, passport) {

// SPLASH PAGE
// =====================================
  app.get('/', function(request, response) {
    response.render('splash'); // load the index.ejs file
  })


  // LOGIN
  // =====================================
    app.get('/signIn',  (request, response) => {
      response.render('signIn', { message: request.flash('loginMessage') })
    })

    app.post('/signIn',
      passport.authenticate('local-signIn', {
        successRedirect: '/user',
        failureRedirect: '/signIn',
        failureFlash: true
      })
    );

    // app.post('/login', (req, res, next) => {
    //   passport.authenticate('local', (err, user, info) => {
    //     if (err) { handleResponse(res, 500, 'error') }
    //     if (!user) { handleResponse(res, 404, 'User not found') }
    //     if (user) {
    //       req.logIn(user, function (err) {
    //         if (err) { handleResponse(res, 500, 'error') }
    //         handleResponse(res, 200, 'success')
    //       })
    //     }
    //   })(req, res, next)
    // })

    // app.post('/signIn', passport.authenticate('local', { failureRedirect: '/login' }),
    //   (request, response) => {
    //     response.redirect('user', { user: user })
    //   }
    // )


  // SIGNUP
  // =====================================
    app.get('/signUp', (request, response) => {
          response.render('signUp', { message: request.flash('signUpMessage') })
    })

    app.post('/signUp',
      passport.authenticate('local-signup', {
        successRedirect : '/user',
        failureRedirect : '/signUp',
        failureFlash : true
      })
    )


    // function handleResponse(res, code, statusMsg) {
    //   res.status(code).json({status: statusMsg})
    // }
    //
    // app.post('/signUp', (req, res, next)  => {
    //   return createUser(req, res)
    //   .then((response) => {
    //     passport.authenticate('local', (err, user, info) => {
    //       if (user) { handleResponse(res, 200, 'success') }
    //     })(req, res, next)
    //   })
    //   .catch((err) => { handleResponse(res, 500, 'error') })
    // })


    // app.post('/signUp', (request, response) => {
    //   createUser(request.body.name, request.body.email, request.body.password)
    //   .then(
    //     response.redirect('user', { user: user })
    //   )
    // })


// HOME PAGE
// =====================================
  app.get('/home', (request, response) => {
    queries.getAlbums((error, albums) => {
      if (error) {
        response.status(500).render('error', { error: error })
      } else {
        response.render('index', { albums: albums })
      }
    })
  })


// ALBUM
// =====================================
  app.get('/albums/:albumID', (request, response) => {
    const albumID = request.params.albumID
    queries.getAlbumsByID(albumID, (error, albums) => {
      if (error) {
        response.status(500).render('error', { error: error })
      } else {
        const album = albums[0]
        response.render('album', { album: album })
      }
    })
  })


// PROFILE
// =====================================
  // get the user out of session and pass to template
  app.get('/user', isLoggedIn, (request, response) => {
    response.render('user', { user : request.user })
  })

  // app.get('/user/:userID', (request, response) => {
  //   const userID = request.params.userID
  //   queries.getUserByID(userID, (error, users) => {
  //     if (error) {
  //       response.status(500).render('error', { error: error })
  //     } else {
  //       const user = users[0]
  //       response.render('user', { user: user })
  //     }
  //   })
  // })

  function isLoggedIn(request, response, next) {
    if (request.isAuthenticated())
      return next()
    response.redirect('/user')
  }

// LOGOUT
// =====================================
  app.get('/logout', (request, response) => {
      request.logout()
      response.redirect('/')
    }
  )


// REVIEWS
// =====================================
  app.get('/review/:albumID', (request, response) => {
    const albumID = request.params.albumID
    queries.getAlbumsByID(albumID, (error, albums) => {
      if (error) {
        response.status(500).render('error', { error: error })
      } else {
        const album = albums[0]
        response.render('review', { album: album })
      }
    })
  })

  // app.post('/review/:albumID', (request, response) => {
  //   console.log("review the thing!");
  // })


// ERROR
// =====================================
  app.use((request, response) => {
    response.status(404).render('not_found')
  })

}
