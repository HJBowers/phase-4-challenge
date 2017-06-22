const pg = require('pg')
const dbName = 'vinyl'
const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${dbName}`
const client = new pg.Client(connectionString)

client.connect()

// Query helper function
const query = function(sql, variables, callback){
  console.log('QUERY ->', sql.replace(/[\n\s]+/g, ' '), variables)

  client.query(sql, variables, function(error, result){
    if (error){
      console.log('QUERY <- !!ERROR!!')
      console.error(error)
      callback(error)
    }else{
      console.log('QUERY <-', JSON.stringify(result.rows))
      callback(error, result.rows)
    }
  })
}

const getAlbums = function(callback) {
  query("SELECT * FROM albums", [], callback)
}

const getAlbumsByID = function(albumID, callback) {
  query("SELECT * FROM albums WHERE id = $1", [albumID], callback)
}

const getReviewsByID = function(reviewID, callback) {
  query("SELECT * FROM reviews WHERE id = $1", [reviewID], callback)
}

const createReview = function(album_id, user_id, review, callback) {
  query("INSERT INTO reviews (album_id, user_id, review) VALUES ($1, $2, $3)", [album_id, user_id, review], callback)
}

const getUserByEmail = function(email, callback) {
  query("SELECT * FROM users WHERE localemail = $1", [email], callback)
}

const getUserByID = function(userID, callback) {
  query("SELECT * FROM users WHERE id = $1", [userID], callback)
}

const createUser = function(username, useremail, userpassword, callback) {
  query("INSERT INTO users (name, localemail, localpassword) VALUES ($1, $2, $3)", [username, useremail, userpassword], callback)
}

module.exports = {
  createUser,
  getAlbums,
  getAlbumsByID,
  getUserByEmail,
  getUserByID
}
