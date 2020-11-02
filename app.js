const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleware");

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
app.get("*", checkUser); // the '*' represents a wildcard that will match every route.
app.get("/", (req, res) => res.render("home"));
// Add requireAuth middleware to restrict access to authenticated users only
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies")); // controller
app.use(authRoutes);
