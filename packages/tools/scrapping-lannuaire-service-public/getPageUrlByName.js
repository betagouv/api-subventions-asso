const axios = require("axios").default;
const { JSDOM } = require("jsdom");

const ANNUAIRE_SEARCH_URL = "https://lannuaire.service-public.fr/recherche";

/**
 *
 * @param {string} name
 * @returns {Promise<null|string>}
 */
module.exports = async function getPageUrlByName(name) {
    const queryName = name.replaceAll(" ", "+");
    const url = `${ANNUAIRE_SEARCH_URL}?whoWhat=${queryName}&where=`;
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
        const resultElement = dom.window.document.getElementById("result_1");

        if (!resultElement) {
            console.error("URL NOT FOUND FOR " + name);
            return null;
        }
        const aElement = resultElement.querySelector("a");

        const href = aElement.href;

        return href;
    } catch (error) {
        console.error(error);
        return null;
    }
};
