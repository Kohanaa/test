const Admin= require("../model/Admin.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const homePage = (req, res) => {
    res.render('home');
}
const loginPage = (req, res) => {
    res.render('login')
}
const login = (req, res) => {
    const admin = Admin.findOne({ name: req.body.name })
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
    logout
}