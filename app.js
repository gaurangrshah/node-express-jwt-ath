const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

const app = express();

// middleware
app.use(express.static("public")); // allows serving of static files such as images/css
app.use(express.json()); // will run on each route that applies (DEL/PUT/POST requests)
app.use(cookieParser()); // library to help manage cookies

// view engine -- uses ejs as a view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://superadmin:2020@cluster0.rao2b.mongodb.net/node-auth";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// register routes - routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", (req, res) => res.render("smoothies")); // controller
app.use(authRoutes);

// cookies
app.get("/set-cookies", (req, res) => {
  // NOTE: cookie value is a key/value pair: {newUser: true}
  // ❌ res.setHeader("Set-Cookie", "newUser=true");
  res.cookie("newUser", false);
  // 3rd argument is an options object
  res.cookie("isEmployee", true, {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  });
  // cookie expiry = maxAge = 1 day (24 hrs)
  // 1000 milliseconds * 60 seconds * 60 min * 24 hrs

  // cookies will get sent back with the response's headers and be accessible from the browser
  res.send("you got cookie");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies.newUser);
  res.json(cookies.newUser);
});
