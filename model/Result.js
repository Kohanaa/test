const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    answers:[Number],
    user_id:String,
    test_id:String,
    created_at:{type:Date,default:Date.now}
});
const model = mongoose.model('result', schema);
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
exports.create=async(params)=>{
    const result=new model(params);
    await result.save();
    return result
}