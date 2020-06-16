const Link=require("../model/Link")

exports.list=async (req, res) => {
    const copyrights = await Link.menu("copyright")
    res.json(copyrights);
}

exports.listByPlatform=async (req, res) => {
    const copyrights = await Link.menu("copyright", {
        platform: req.params.platform
    });
    res.json(copyrights);
}