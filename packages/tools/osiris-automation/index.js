require('dotenv/config') // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

const fs = require("fs");
const OsirisExtractDownloader = require("./Osiris/OsirisExtractDownloader");
const OsirisPosibilitiesBuilder = require("./Osiris/OsirisPosibilitiesBuilder");
const OsirisPuppeteer = require('./OsirisPuppeteer/OsirisPuppeteer');

const OSIRIS_URL = process.env.OSIRIS_URL || "https://osiris.extranet.jeunesse-sports.gouv.fr/";
const OSIRIS_EMAIL = process.env.OSIRIS_EMAIL || "";
const OSIRIS_PASSWORD = process.env.OSIRIS_PASSWORD || "";
const year = process.argv[2] || new Date().getFullYear().toString();
const posibilitiesFile = process.argv[3] || null
const skip = process.argv[4] || 0;


async function startExtractOsiris(cookies, year) {
    const osirisDownloader = new OsirisExtractDownloader(cookies, year, false);
    const osirisPosibilitiesBuilder = new OsirisPosibilitiesBuilder(year, cookies, false);

    let posibilities = [];
    if (posibilitiesFile && fs.existsSync(posibilitiesFile)) {
        posibilities = JSON.parse(fs.readFileSync(posibilitiesFile, { encoding: "utf-8"}));
    } else {
        posibilities = await osirisPosibilitiesBuilder.buildPosibilities();
        fs.writeFileSync("./current-posibilities.json", JSON.stringify(posibilities));
    }

    await posibilities.reduce(async (acc, posibility, i) => {
        if (i < skip) return acc; 
        await acc;
        await osirisDownloader.download(posibility);
        console.log(`${i}/${posibilities.length}`)
    }, Promise.resolve());
} 


(async () => {
    const osirisPuppeteer = new OsirisPuppeteer(OSIRIS_EMAIL, OSIRIS_PASSWORD, OSIRIS_URL);

    const cookies = await osirisPuppeteer.connect();

    await startExtractOsiris(cookies, year);
    // await osirisPuppeteer.extractDossiers(year);
    await osirisPuppeteer.close();
})();
