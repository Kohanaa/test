const bcrypt = require("bcrypt");
const saltRounds = 10;

const Admin = {
  findOne: (params) => {
    if (!params.name || params.name !== process.env.ADMIN_NAME) {
      return null;
    }
    return {
      _id: 1,
      name: process.env.ADMIN_NAME,
      password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, saltRounds),
    };
  },
};

module.exports = Admin;