require('dotenv').config()
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
require("./model/db.js")
const cookieParser = require("cookie-parser");
const Res = require("./model/Result.js");
const Q = require("./model/Question.js");
const User = require("./model/User.js");
const Admin= require("./model/Admin.js");
const Link = require("./model/Link.js");
var exphbs = require('express-handlebars');
const paginator = require("./service/paginator");
const Test = require("./model/Test.js")
app.set("secretKey", process.env.JWT_SECRET);
app.engine('handlebars', exphbs({
  helpers: {
    ifCond: function (v1, operator, v2, options) {
      switch (operator) {
        case "==":
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },
  }
}));
app.set('view engine', 'handlebars');

// /api/platforms
// ['Cursera', 'НПОО']
app.use(bodyParser.urlencoded({ extended: false }))
 

app.use(bodyParser.json())
app.use(cookieParser());
const validateUser=(req,res,next)=>{
  let token=req.cookies.token
  jwt.verify(token, req.app.get("secretKey"), function (err, decoded) {
    if (err) {
      if (req.xhr) {
        res.json({ status: "error", message: err.message, data: null });
      } else {
        res.redirect(302,"/login");
      }
    } else {
      // add user id to request
      req.userId = decoded.id;
      next();
    }
  });
}
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/api/platforms', async (req, res) => {
  const platforms = await Link.menu("platform");
  res.json(platforms);
});
app.get('/api/platforms/:copyright', async (req, res) => {
  const platforms = await Link.menu("platform", {
    copyright: req.params.copyright
  });
  res.json(platforms);
});
app.get('/api/copyrights', async (req, res) => {
  const copyrights = await Link.menu("copyright")
  res.json(copyrights);
});
app.get('/api/copyrights/:platform', async (req, res) => {
  const copyrights = await Link.menu("copyright", {
    platform: req.params.platform
  });
  res.json(copyrights);
});

app.get('/question/list', validateUser,async (req, res) => {
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
app.get('/user/list', async (req, res) => {
  const users = await User.list();
  res.render('users', { users });
});
app.get('/user/:id', async (req, res) => {
  const user = await User.getById(req.params.id)
  res.render('user', { user });
});
app.get('/link/list', async (req, res) => {
  const criteria = {};
  const { platform, copyright, page = 1 } = req.query
  const limit = 20;
  const skip = limit * (page - 1);
  let prefix = '/link/list?';
  let platforms = await Link.menu("platform");
  let copyrights = await Link.menu("copyright")
  if (platform) {
    criteria.platform = platform;
    prefix += `platform=${platform}&`;
    copyrights = await Link.menu("copyright", { platform })
  }
  if (copyright) {
    criteria.copyright = copyright;
    prefix += `copyright=${copyright}&`;
    platforms = await Link.menu("platform", { copyright })
  }
  const count = await Link.count(criteria);
  const links = await Link.list(criteria, limit, skip);
  const pageItems = paginator.getArray(count, limit, prefix, parseInt(page));
  res.render('links', {
    links,
    platforms,
    copyrights,
    platform,
    copyright,
    pageItems
  });
});
app.get('/link/:id', async (req, res) => {
  const link = await Link.getById(req.params.id)
  res.render('link', { link });
});
app.get('/test/list', async (req, res) => {
  const tests = await Test.list();
  res.render('tests', { tests });
});
app.get('/results/list', async (req, res) => {
  const results = await Res.list();
  res.render('results', { results });
})
app.get('/results/:id', async (req, res) => {
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
})
app.get('/test/:id/result', async (req, res) => {
  const answers = JSON.parse(req.query.answers);
  const test = await Test.getById(req.params.id);
  const resultModel = await Res.create({
    user_id: "1",
    answers: answers,
    test_id: test._id,
  })
  res.redirect('/results/' + resultModel._id, 302)

})
app.get('/test/:id', async (req, res) => {
  const test = await Test.getById(req.params.id);
  const questions = await Q.list({
    _id: {
      $in: test.questions
    }
  });

  res.render('test', { test, questions, count: questions.length });
});
app.get('/login', (req, res) => {
  res.render('login')
})
app.post('/login', (req, res) => {
  const admin=Admin.findOne({name:req.body.name})
  if (!admin) {
    res.json({
      status: "error",
      message: "Invalid email/password!!!",
      data: null,
    });
    return;
  }
  if (!bcrypt.compareSync(req.body.password, admin.password)) {
    res.json({
      status: "error",
      message: "Invalid email/password!!!",
      data: null,
    });
    return;
  }

  const token = jwt.sign({ id: admin._id }, req.app.get("secretKey"), {
    expiresIn: "8h",
  });

  res.cookie("token", token, {
    expires: new Date(Date.now() + 8 * 3600000),
    httpOnly: true,
  });

  res.redirect(302, "/");
 // res.render('login')
})
app.use(express.static("public"));





app.listen(port, () => console.log(`Example app listening on port ${port}!`))