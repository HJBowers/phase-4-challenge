const queries = require('../config/queries')

module.exports = function(app) {

  // SPLASH PAGE
  // =====================================
    app.get('/', function(request, response) {
      response.render('splash');
    })


  // LOGIN
  // =====================================
    app.get('/signIn',  (request, response) => {
      response.render('signIn', { message: request.flash('loginMessage') })
    })

    app.post('/signIn', (request, response) => {
      var email = request.body.email
      var password = request.body.password
      queries.getUserByEmail(email, (error, users) => {
        if (error) {
          response.status(500).render('error', { error: error })
        } else {
          console.log("User object:", users[0])
          if(users[0].localpassword = password) {
            response.redirect('user')
          }
        }
      })
    });


  // SIGNUP
  // =====================================
    app.get('/signUp', (request, response) => {
          response.render('signUp', { message: request.flash('signUpMessage') })
    })

    app.post('/signUp', (request, response) => {
      queries.createUser(request.body.name, request.body.email, request.body.password, (error, albums) => {
        if (error) {
          response.status(500).render('error', { error: error })
        } else {
          response.redirect('/user')
        }
      })
    })


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
  app.get('/user', (request, response) => {
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
  //
  // function isLoggedIn(request, response, next) {
  //   if (request.isAuthenticated())
  //     return next()
  //   response.redirect('/user')
  // }

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
