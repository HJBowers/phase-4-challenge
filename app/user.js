// var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local: {
      email: String,
      password: String
    }
  })


// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


passport.use(new LocalStrategy(
    function(username, password, done) {
         sql.query(conn_str, "SELECT * FROM <user_table> WHERE username=?", [username], function (err, users) {

            //check user's hashed password against the hash of what was passed in

            done(null, users[0]);
        }
    }
});
