const questions = [{
    id: 1,
    text: 'вопрос 1',
    options: [{
        text: "1"
    },
    { text: "2" },
    { text: "3" },
    {
        text: "4"
    }],
    anwser: 3
},
{
    id: 2,
    text: 'вопрос 2',
    options: [{
        text: "2"
    },
    { text: "2" },
    { text: "3" },
    {
        text: "4"
    }],
    anwser: 1
},
{
    id: 3,
    text: 'вопрос 3',
    options: [{
        text: "3"
    },
    { text: "2" },
    { text: "3" },
    {
        text: "4"
    }],
    anwser: 1
}];

exports.list=()=>{
    return questions
}
exports.getById=(id)=>{
    return questions.find((item)=>{
        return item.id==id
    })
}
exports.getRandom=()=>{
    return questions[Math.floor(Math.random() * Math.floor(questions.length))];
}