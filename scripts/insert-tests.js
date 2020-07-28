// получить все вопросы из БД

// разделить все вопросы на группы из 10 штук

// для каждой группы создать отдельный объект test
require('dotenv').config({
    path: '../.env'
})
require("../model/db.js")
const Test=require("../model/Test.js")
const Question=require("../model/Question.js")

const init = async() => {
    return
    const questions=await (await Question.list({},200)).map(question=>question._id)
    console.log(questions)
    for(let i=0;i<questions.length;i+=10){
        const arrQuestions=questions.slice(0+i,10+i)
        console.log(arrQuestions)
        await Test.store({
            name:`js test ${1 + i/10}`,
            questions:arrQuestions,
            success: 70
        })
    }
}

init();