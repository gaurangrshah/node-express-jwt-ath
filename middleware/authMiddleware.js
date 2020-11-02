const jwt = require("jsonwebtoken");

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

module.exports = { requireAuth };
