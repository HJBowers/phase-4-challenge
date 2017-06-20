const express = require('express')
const bodyParser = require('body-parser')
const database = require('./database')
const app = express()

require('ejs')
app.set('view engine', 'ejs');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (request, response) => {
  database.getAlbums((error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('index', { albums: albums })
    }
  })
})

app.get('/user/:userID', (request, response) => {
  const userID = request.params.userID
  database.getUserByID(userID, (error, users) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const user = users[0]
      response.render('user', { user: user })
    }
  })
})

app.get('/albums/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums[0]
      response.render('album', { album: album })
    }
  })
})

app.get('/signUp', (request, response) => {
    response.render('signUp')
})

app.post('/signUp', (request, response) => {
    response.render('signUp')
})

app.get('/signIn', (request, response) => {
  database.getUsers((error, users) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      response.render('signIn', { users: users })
    }
  })
})

app.post('/signIn', (request, response) => {
    response.render('signIn')
})

app.get('/review/:albumID', (request, response) => {
  const albumID = request.params.albumID

  database.getAlbumsByID(albumID, (error, albums) => {
    if (error) {
      response.status(500).render('error', { error: error })
    } else {
      const album = albums[0]
      response.render('review', { album: album })
    }
  })
})

app.post('/review/:albumID', (request, response) => {
  console.log("review the thing!");
})


app.use((request, response) => {
  response.status(404).render('not_found')
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}...`)
})
