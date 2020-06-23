const Q = require("../model/Question.js");
const listPage = async (req, res) => {
    const questions = await Q.list();
    res.render('questions', { questions });
  };

  const randomPage = async (req, res) => {
    const question = await Q.getRandom();
    res.render('question', { question });
  };

  const viewPage = async (req, res) => {
    const question = await Q.getById(req.params.id)
    res.render('question', { question });
  };

  module.exports = {
    listPage,
    randomPage,
    viewPage
  }