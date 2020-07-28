const Res=require("../model/Result")
const Q = require("../model/Question.js");
const Test = require("../model/Test.js")
exports.my = async (req,res)=> {
    const resultModels = await Res.list({
        user_id:req.userId
    })
    const errorQuestions = [];
    for(let i=0;i<resultModels.length;i++){
        const resultModel = resultModels[i];
        const test = await Test.getById(resultModel.test_id);
        const questions = await Q.list({
        _id: {
                $in: test.questions
            }
        });
        const answers = resultModel.answers;
        

        for (let i = 0; i < questions.length; i++) {
            if(questions[i].answer != answers[i]){
                const question = questions[i];
                errorQuestions.push({
                    // текст вопроса
                    text: question.text,
                    // код
                    code:question.code,
                    // верный ответ
                    correct_answer:question.options[question.answer].text,
                    // ответ, который дал пользователь
                    user_anwser:question.options[answers[i]].text,
                    // объяснение
                    explanation:question.explanation,                   
                })
            }
        }
    }

    res.send('<pre>' + JSON.stringify({
        errorsCount:errorQuestions.length,
        errorQuestions,
    }, null, 2) + '</pre>')
}

