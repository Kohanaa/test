const mongoose = require("mongoose");
const AnswerSchema = new mongoose.Schema({
  user_answer: Number,
  correct_answer: Number,
  is_correct: Boolean,
  question_id: String,
  created_at:{ type:Date, default:Date.now }
});

const schema = new mongoose.Schema({
    answers:{
      type: [AnswerSchema],
      default: []
    },
    user_id:String,
});

const model = mongoose.model('ResultAnswer', schema);

exports.getByUserId=async(user_id) => {
  return await model.findOne({user_id})
}

exports.create = async (user_id)  => {
  const resultAnswer = new model({
    user_id
  })
  await resultAnswer.save();
  return resultAnswer;
}

exports.addAnswer = async (resultAnswer, answer) => {
  // user_answer, correct_answer, question_id
  answer.is_correct = (answer.user_answer == answer.correct_answer);
  resultAnswer.answers.push(answer);
  await resultAnswer.save();
  return resultAnswer;
}