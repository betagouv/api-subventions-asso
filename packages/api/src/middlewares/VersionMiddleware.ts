export const versionMiddleware = async (req, _res, next) => {
    let version = req.url.split("/")[1];
    if (!["v1", "v2"].includes(version)) {
        console.log("redirecting to default API - V2");
        version = "v2";
        _res.redirect(`/v2${req.url}`);
    } else {
        req.apiVersion = version;
        console.log(req.url);
        console.log(`currently using API ${version}`);
        next();
    }
};
