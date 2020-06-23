const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
    let token = req.cookies.token
    jwt.verify(token, req.app.get("secretKey"), function (err, decoded) {
        if (!err) {
            req.isAuthed = !!decoded.id;
        }
        next();
    });
}

const validateUser = (req, res, next) => {
    let token = req.cookies.token
    jwt.verify(token, req.app.get("secretKey"), function (err, decoded) {
        if (err) {
            if (req.xhr) {
                res.json({ status: "error", message: err.message, data: null });
            } else {
                res.redirect(302, "/login");
            }
        } else {
            // add user id to request
            req.userId = decoded.id;
            next();
        }
    });
}
module.exports = {
    isAuth,
    validateUser
}