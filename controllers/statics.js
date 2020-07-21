const Admin= require("../model/Admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User=require("../model/User.js");
const homePage = (req, res) => {
    res.render('home');
}
const loginPage = (req, res) => {
    res.render('login')
}
const login = async (req, res) => {
    const admin = Admin.findOne({ name: req.body.name })
    const user = await User.findOne({name:req.body.name})
    if (!admin && !user) {
        res.json({
            status: "error",
            message: "Invalid email/password!!!",
            data: null,
        });
        return;
    }
    if (!bcrypt.compareSync(req.body.password, admin ? admin.password : user.password)) {
        res.json({
            status: "error",
            message: "Invalid email/password!!!",
            data: null,
        });
        return;
    }

    const token = jwt.sign({ id: admin ? admin._id : user._id }, req.app.get("secretKey"), {
        expiresIn: "8h",
    });

    res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
    });

    res.redirect(302, "/");
    // res.render('login')
}
const signupPage=(req,res)=>{
    res.render('signup')
}
const signup=async(req,res)=>{
    // получить параметры (name, password)
    const name=req.body.name
    const password=req.body.password

    // найти в БД пользователя с таким именем
    // если уже есть, то вернуть ошибку
    const user = await User.findOne({ name: req.body.name })
    if (user){
        res.json({
            error:"this user exists"
        })
        return
    }
    
    // создание нового пользователя. При этом нужно сгенерировать пароль
    // (перед этим нужно добавить поле password в модель)
    const newUser=await User.create({name,password})

    // отправить пользователя на страницу входа
    res.redirect(302, "/login");
}
const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(Date.now() - 24 * 3600000),
        httpOnly: true,
    })
    res.redirect(302, "/login");
}

module.exports = {
    homePage,
    loginPage,
    login,
    logout,
    signupPage,
    signup
}