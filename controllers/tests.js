const Q = require("../model/Question.js");
const Res = require("../model/Result.js");
const Test = require("../model/Test.js")

const listPage = async (req, res) => {
    const tests = await Test.list();
    res.render('tests', { tests });
}

const resultPage = async (req, res) => {
    const answers = JSON.parse(req.query.answers);
    const test = await Test.getById(req.params.id);
    const resultModel = await Res.create({
        user_id: "1",
        answers: answers,
        test_id: test._id,
    })
    res.redirect('/results/' + resultModel._id, 302)

}

const viewPage = async (req, res) => {
    const test = await Test.getById(req.params.id);
    const questions = await Q.list({
        _id: {
            $in: test.questions
        }
    });

    res.render('test', { test, questions, count: questions.length });
}

module.exports = {
    listPage,
    resultPage,
    viewPage
}