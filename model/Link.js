const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    "id": "number",
    "title": "string",
    "platform": "string",
    "copyright": "string",
    "credits": "number",
    "link": "string",
    "weeks": "number",
    "type": "string",
    "flags": "number"
});
const model = mongoose.model('links', schema);
exports.getById = async (id) => {
    return await model.findOne({ _id: id })
        .exec()
        .then(item => {
            return item.toObject();
        });
}
exports.count = async (condition) => {
    return await model.countDocuments(condition)
        .exec()
        .then(count => {
            return count;
        });
}
exports.list = async (condition, limit=20, skip=0) => {
    if (!condition) {
        condition = {}
    }
    return await model.find(condition)
        .limit(limit)
        .skip(skip)
        .exec()
        .then(items => {
            return items.map(item=>item.toObject());
        });
}
exports.menu= async(field, criteria={})=>{
    return await model.distinct(field, criteria).exec()
}