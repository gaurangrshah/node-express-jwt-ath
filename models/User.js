const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

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

// fires "before" doc saved to db
userSchema.pre("save", async function (next) {
  // NOTE: runs before saving -- so no doc avialable yet
  const salt = await bcrypt.genSalt(); // generate new password salt

  // "this" refers to the newly created user instance
  this.password = await bcrypt.hash(this.password, salt); // has current password with salt
  next();
});

// static user login method
userSchema.statics.login = async function (email, password) {
  // find the user from the User model who matches the submitted email
  const user = await this.findOne({ email });
  if (user) {
    // compare the current submitted password to the hashed password from db
    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      // if passwords match:
      return user;
    }
    throw Error("incorrect password");
  }

  throw Error("incorrect email");
};

// the model must be in the "singular" form of of model name
const User = mongoose.model("user", userSchema);
module.exports = User;
