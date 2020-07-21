const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const schema = new mongoose.Schema({
  name: 'string',
  password:"string",
});
const model = mongoose.model('Users', schema);
exports.getById = async (id) => {
    return await model.findOne({ _id: id })
        .exec()
        .then(item => {
            return item.toObject();
        });
}
exports.list = async (condition, limit) => {
    if (!condition) {
        condition = {}
    }
    const resLimit = limit || 50;
    return await model.find(condition)
        .limit(resLimit)
        .exec()
        .then(items => {
            return items.map(item=>item.toObject());
        });
}
exports.findOne = async (criteria) => {
    return await model.findOne(criteria)
        .exec()
        .then(item => {
            return item ? item.toObject() : null;
        });
}
exports.create=async(params)=>{
    const result=new model({
        name: params.name,
        password: bcrypt.hashSync(params.password, saltRounds),
    });
    await result.save();
    return result
}