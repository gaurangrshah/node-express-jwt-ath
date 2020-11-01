const User = require("../models/User");

const handleErrors = (err) => {
  let errors = { email: "", password: "" };
  console.log(err.message, err.code);

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
    // handle success - set statusCode and include user as json object
    res.status(201).json(user);
  } catch (err) {
    // handle errors
    const errors = handleErrors(err);
    res.status(400).json(errors);
  }
};

module.exports.login_post = async (req, res) => {
  try {
    const { email, password } = req.body;
    // create new user in database
    const user = await User.create({ email, password });
    res.status(201).json(user);
    res.send("user login");
  } catch (err) {
    // handle errors
    const errors = handleErrors(err);
    res.status(400).send("Your request could not be processed");
  }
};
