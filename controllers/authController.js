// controller actions for all authenticated routes
module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, passwprd } = req.body;
  res.send("user signup");
};

module.exports.login_post = async (req, res) => {
  const { email, passwprd } = req.body;
  res.send("user login");
};
