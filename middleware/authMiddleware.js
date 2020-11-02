const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const requireAuth = (req, res, next) => {
  // extract token from cookie
  const token = req.cookies.jwt; // cookie parser gives us access to the cookie on the request obj
  // check if token exists and is valid
  if (token) {
    // must use the same secret used ot set jwt
    jwt.verify(token, "myappsecret", (err, decodedToken) => {
      if (err) {
        // handle error if verification fails
        console.log(err.message);
        res.redirect("/login");
      } else {
        // if no errors move to the next middleware in stack
        console.log(decodedToken);
        next(); // moves onto execute request and serve protected route
      }
    });
  } else {
    // if no token redirect user to login
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "myappsecret", async (err, decodedToken) => {
      if (err) {
        // handle errors
        console.log(err.message);
        res.locals.user = user; // set user on response.locals to null
        next();
      } else {
        // handle success
        // grab user._id from token payload:
        let user = await User.findById(decodedToken.id);
        res.locals.user = user; // set user onto response.locals
        next();
      }
    });
  } else {
    // if token is invalid/user does not exist
    res.locals.user = null; // nullify the user property on req.locals
    next();
  }
};

module.exports = { requireAuth, checkUser };
