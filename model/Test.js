const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    name:'string',
    questions:[String],
    success:"number"
});
const model = mongoose.model('tests', schema);
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