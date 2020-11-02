const { Router } = require("express");
const authController = require("../controllers/authController");

// instantiate router
const router = Router();

// define all authtenticated routes, and assign respective controller
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);

// add logout route and controller:
router.get("/logout", authController.logout_get);

module.exports = router;
