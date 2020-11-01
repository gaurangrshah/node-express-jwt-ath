const mongoose = require("mongoose");
const { isEmail } = require("validator");
var bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    // ❌ required: true,
    required: [true, "Please enter an email addres"],
    unique: [true, "sorry this email address already belongs to a user"],
    lowercase: true, // coerce to lowercase in database
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [6, "Password must be atleast 6 characters long"],
  },
});

// // fires "after" a doc saved to db
// userSchema.post("save", function (doc, next) {
//   console.log("new user was created", doc);
//   next();
// });

// fires "before" doc saved to db
userSchema.pre("save", async function (next) {
  // NOTE: runs before saving -- so no doc avialable yet
  const salt = await bcrypt.genSalt(); // generate new password salt

  // "this" refers to the newly created user instance
  this.password = await bcrypt.hash(this.password, salt); // has current password with salt
  next();
});

// the model must be in the "singular" form of of model name
const User = mongoose.model("user", userSchema);
module.exports = User;
