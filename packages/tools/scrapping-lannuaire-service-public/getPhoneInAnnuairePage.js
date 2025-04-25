const axios = require("axios").default;
const { JSDOM } = require("jsdom");

const cache = {};

/**
 *
 * @param {string} url page url
 * @returns {Promise<null|string>}
 */
module.exports = async function getPhoneInAnnuairePage(url) {
    if (cache[url]) {
        return cache[url];
    }

    try {
        const result = await axios.get(url);

        if (result.status != 200) {
            console.error({
                status: result.status,
                body: result.data,
            });
            return null;
        }

        const html = result.data;
        const dom = new JSDOM(html);
        const resultElements = dom.window.document.getElementsByClassName("tel");

        if (!resultElements.length) {
            console.error("PHONE NOT FOUND FOR " + url);
            return null;
        }

        const phone = resultElements[0].href.replace("tel:", "");
        cache["url"] = phone;
        return phone;
    } catch (error) {
        console.error(error);
        return null;
    }
};
