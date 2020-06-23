require('dotenv').config()

const express = require('express')
const app = express()
const port = 3000
require("./model/db.js")

/* Middlewares */
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const {isAuth,validateUser}=require("./service/auth")
const {getConfig}=require("./service/handlebars")

/* Controllers */
const apiPlatforms = require("./controllers/apiPlatforms")
const apiCopyrights = require("./controllers/apiCopyrights")
const results = require("./controllers/results")
const statics = require("./controllers/statics")
const questionsController = require("./controllers/questions")
const testsController = require("./controllers/tests")
const usersController = require("./controllers/users");
const linksController = require("./controllers/links")

var exphbs = require('express-handlebars');
app.set("secretKey", process.env.JWT_SECRET);
app.engine('handlebars', exphbs(getConfig()));
app.set('view engine', 'handlebars');

/* Using Middlewares */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(function (req, res, next) {
  res.locals.req = req;
  next();
})
app.use(isAuth)

/** Static Pages */
app.get('/', statics.homePage);
app.get('/login', statics.loginPage);
app.post('/login', statics.login)
app.get('/logout', statics.logout)

/** API routes */
/** API platform routes */
app.get('/api/platforms', apiPlatforms.list);
app.get('/api/platforms/:copyright', apiPlatforms.listByCopyright);

/** API copyright routes */
app.get('/api/copyrights', apiCopyrights.list);
app.get('/api/copyrights/:platform', apiCopyrights.listByPlatform);

/** Dynamic pages */
/** Questions */
app.get('/question/list', validateUser, questionsController.listPage);
app.get('/question/random', questionsController.randomPage);
app.get('/question/:id', questionsController.viewPage);

/** Users */
app.get('/user/list', usersController.listPage);
app.get('/user/:id', usersController.viewPage);

/** Links */
app.get('/link/list', linksController.listPage);
app.get('/link/:id', linksController.viewPage);

/** Tests */
app.get('/test/list', testsController.listPage);
app.get('/test/:id/result', testsController.resultPage)
app.get('/test/:id', testsController.viewPage);

/** Results */
app.get('/results/list', validateUser, results.list)
app.get('/results/:id', validateUser, results.getById)

app.use(express.static("public"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`))