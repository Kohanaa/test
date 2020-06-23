const User = require("../model/User.js");

const listPage = async (req, res) => {
  const users = await User.list();
  res.render('users', { users });
};

const viewPage = async (req, res) => {
  const user = await User.getById(req.params.id)
  res.render('user', { user });
};

module.exports = {
  listPage,
  viewPage
}