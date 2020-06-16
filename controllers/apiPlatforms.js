const Link=require("../model/Link")

exports.list=async (req, res) => {
    const platforms = await Link.menu("platform");
    res.json(platforms);
}

exports.listByCopyright=async (req, res) => {
    const platforms = await Link.menu("platform", {
        copyright: req.params.copyright
    });
    res.json(platforms);
}