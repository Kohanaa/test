const express = require('express')
const app = express()
const port = 3000
const Q = require("./model/Question.js")
var exphbs = require('express-handlebars');


app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/',  (req, res) =>{
    res.render('home');
});

app.get('/question/list', async (req, res) =>{
    const questions = await Q.list();
    res.render('questions', { questions });
});
app.get('/question/random', async (req, res) => {
    const question = await Q.getRandom();
    res.render('question', { question });
});
app.get('/question/:id', async (req, res) => {
    const question = await Q.getById(req.params.id)
    res.render('question', { question });
});

app.use(express.static("public"));





app.listen(port, () => console.log(`Example app listening on port ${port}!`))