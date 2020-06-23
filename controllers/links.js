const Link = require("../model/Link.js");
const paginator = require("../service/paginator");
const listPage = async (req, res) => {
    const criteria = {};
    const { platform, copyright, page = 1 } = req.query
    const limit = 20;
    const skip = limit * (page - 1);
    let prefix = '/link/list?';
    let platforms = await Link.menu("platform");
    let copyrights = await Link.menu("copyright")
    if (platform) {
        criteria.platform = platform;
        prefix += `platform=${platform}&`;
        copyrights = await Link.menu("copyright", { platform })
    }
    if (copyright) {
        criteria.copyright = copyright;
        prefix += `copyright=${copyright}&`;
        platforms = await Link.menu("platform", { copyright })
    }
    const count = await Link.count(criteria);
    const links = await Link.list(criteria, limit, skip);
    const pageItems = paginator.getArray(count, limit, prefix, parseInt(page));
    res.render('links', {
        links,
        platforms,
        copyrights,
        platform,
        copyright,
        pageItems
    });
}
const viewPage = async (req, res) => {
    const link = await Link.getById(req.params.id)
    res.render('link', { link });
}

module.exports = {
    listPage,
    viewPage
}
