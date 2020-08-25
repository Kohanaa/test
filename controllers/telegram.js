require('../model/db');
const Test = require('../model/Test');
const Question=require("../model/Question");
const ResultAnswer=require("../model/ResultAnswer");
const reformatButtons = (buttons, columns = 1) => {
    const a=[];
    for(let i=0;i<buttons.length;i+=columns){
        a.push(buttons.slice(i,i+columns))
    }
    return a
}

const test = async (bot, msg)=>{
    const chatId = msg.chat.id;
    const tests = await Test.list();
    const buttons = [];
    for(let i=0;i<tests.length;i++){
        buttons.push({
            text:tests[i].name,
            callback_data:JSON.stringify(['test_choice', tests[i]._id])
        })
    }
    const reformattedButtons = reformatButtons(buttons, 4);

    bot.sendMessage(chatId, 'Выбор теста: ',{
        reply_markup:{
            inline_keyboard: reformattedButtons
        }
    } );
}

const testChoice = async (bot, chat_id, user_id, id) => {
    const test=await Test.getById(id)
    const buttons = [];
    for(let i=0;i<test.questions.length;i++){
        buttons.push({
            text: `Вопрос #${i+1}`,
            callback_data:JSON.stringify(['question_choice', test.questions[i]])
        })
    }
    const reformattedButtons = reformatButtons(buttons, 4);

    bot.sendMessage(chat_id, 'Выбор вопроса: ',{
        reply_markup:{
            inline_keyboard: reformattedButtons
        }
    } );
}
const questionChoice = async(bot, chat_id, user_id, id)=>{
    const question=await Question.getById(id)
    const buttons=[];
    for(let i=0;i<question.options.length;i++){
        buttons.push({
            text: question.options[i].text,
            callback_data:JSON.stringify(['option_choice', question._id,i])
        })
    }
    const reformattedButtons = reformatButtons(buttons, 1);
    bot.sendMessage(chat_id, `${question.text}
${question.code || ''}`,{
        reply_markup:{
            inline_keyboard: reformattedButtons
        }
    })
}
const optionChoice= async(bot, chat_id, user_id, id,option_index)=>{
    const question = await Question.getById(id)
    let resultAnswer = await ResultAnswer.getByUserId(user_id);
    if(!resultAnswer) {
        resultAnswer = await ResultAnswer.create(user_id)
    }
    await ResultAnswer.addAnswer(resultAnswer, {
        user_answer: option_index,
        correct_answer: question.answer,
        question_id:question._id,
    })
    let text;
    if(question.answer==option_index) {
        text=`Верно.
`
    } else {
        text=`Неверно.
Верный ответ: ${question.options[question.answer].text}
`
    }
    text+=question.explanation
    bot.sendMessage(chat_id, text);

}
module.exports={
    test,
    testChoice,
    questionChoice,
    optionChoice,

}