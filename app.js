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
