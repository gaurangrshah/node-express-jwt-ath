const User = require("../models/User");
const jwt = require("jsonwebtoken");

const maxAge = 3 * 24 * 60 * 60; // 3days * 24hrs * 60mins * 60secs === 3days/ 36hrs (in seconds)

const createToken = (id) => {
  // a secret is used to sign our token, and is used to then verify our tokens as well.
  return jwt.sign({ id }, "myappsecret", { expiresIn: maxAge });
  // NOTE: secrets should never be inserted directly into the application and should not be leaked
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  // incorrect email
  if (err.message === "incorrect email") {
    errors.email = "email not found";
  }
  // incorrect password
  if (err.message === "incorrect password") {
    errors.email = "password is incorrect";
  }

  // duplicate error code
  if (err.code === 11000) {
    // duplicate email records will throw a 11000 error status code
    errors.email = "that email is already registered";
  }
  // validation errors
  // all auth errors will have the phrase "user validation failed"
  if (err.message.includes("user validation failed")) {
    // descturcture properties from errors object
    Object.values(err.errors).forEach(({ properties }) => {
      return (errors[properties.path] = properties.message);
    });
  }
  return errors;
};

// controller actions for all authenticated routes
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    // create new user in database
    const user = await User.create({ email, password });

    // generate signed token:
    const token = createToken(user._id);
    // set token as cookie, and expiry value ===  3days (in milliseconds)
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    // handle success - set statusCode and include user._id
    res.status(201).json({ user: user._id });
  } catch (err) {
    // handle errors
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  // create new user in database
  try {
    // call the static login method we defined on the user model:
    const user = await User.login(email, password);

    // generate signed token:
    const token = createToken(user._id);
    // set token as cookie, and expiry value ===  3days (in milliseconds)
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.logout_get = (req, res) => {
  // set cookie value to blank string and expires in 1sec
  res.cookie("jwt", "", { maxAge: 1 });
  // NOTE: there is no straightforward way to delete a cookie value,
  // so instead we just nullify its value
  res.redirect("/login"); // send user to login page on logout
};
