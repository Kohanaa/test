const Res=require("../model/Result")
const Q = require("../model/Question.js");
const Test = require("../model/Test.js")
exports.list=async (req, res) => {
    const results = await Res.list();
    res.render('results', { results });
}

exports.getById=async (req, res) => {
    const resultModel = await Res.getById(req.params.id);
    const test = await Test.getById(resultModel.test_id);
    const questions = await Q.list({
      _id: {
        $in: test.questions
      }
    });
    const answers = resultModel.answers;
    const questionsInfo = []
    let correctAnswers = 0;
    for (let i = 0; i < questions.length; i++) {
      let questionInfo = {
        num: 'Вопрос ' + (i + 1),
        text: questions[i].text,
        options: questions[i].options.map((option, optionIndex) => {
          return {
            correct_answer: questions[i].answer == optionIndex,
            user_answer: answers[i] == optionIndex,
            text: option.text
          };
        })
      }
      questionsInfo.push(questionInfo);
      if (questions[i].answer == answers[i]) {
        correctAnswers += 1;
      }
    }
  
    const result = Math.round(correctAnswers * 100 / questions.length)
    res.render('result', {
      questionsInfo,
      result,
      successFlag: result >= test.success
    })
  }