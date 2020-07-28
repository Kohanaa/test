const mongoose = require("mongoose");
const optionSchema = new mongoose.Schema({
    text: 'string',
});
const schema = new mongoose.Schema({
    text: 'string',
    options:[optionSchema],
    anwser:'number',
    vertical:"number",
    code:"string",
    explanation:"string"
});
const model = mongoose.model('questions', schema);
const getById=async (id) => {
    return await model.findOne({ _id: id })
        .exec()
        .then(item => {
            return item ?item.toObject() : item;
        });
}
exports.getRandom = async () => {
    const ids= await model.find().distinct("_id").exec().then(items => {
        return items
    });
    const id= ids[Math.floor(Math.random() * Math.floor(ids.length))];
    return await getById(id);
}
exports.getById = getById;
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
