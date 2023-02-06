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

async function getCookie() {
    console.log("Getting cookies");
    const osirisPuppeteer = new OsirisPuppeteer(OSIRIS_EMAIL, OSIRIS_PASSWORD, OSIRIS_URL);

    const cookies = await osirisPuppeteer.connect();
    console.log("Cookies as found");

    return cookies;
}

async function downloadPosibilities(year, posibilities, i) {
    if (!this.downloader) {
        console.log("Connect osiris extract downloader");
        this.downloader = new OsirisExtractDownloader(await getCookie(), year, true);
        await this.downloader.loadPromise;
        await new Promise(r => setTimeout(r), 1000);
        console.log("Downloader as init");
    }
    const posibility = posibilities[i];

    if (!posibility) return;

    try {
        console.log(`Start to download ${i}/${posibilities.length}`);

        await this.downloader.download(posibility, getCookie);
        console.log(`End to download ${i}/${posibilities.length}`);

        return await downloadPosibilities(year, posibilities, Number(i) + 1);
    } catch {
        // Retry download but restart downloader
        this.downloader = null;
        console.log("Error retry to download current posibility");
        await new Promise(r => setTimeout(r), 1000 * 60 * 10); // 10min for wait osiris restart;
        return await downloadPosibilities(year, posibilities, i);
    }

}

async function startExtractOsiris(year) {
    let posibilities = [];
    if (posibilitiesFile && fs.existsSync(posibilitiesFile)) {
        posibilities = JSON.parse(fs.readFileSync(posibilitiesFile, { encoding: "utf-8" }));
    } else {
        const osirisPosibilitiesBuilder = new OsirisPosibilitiesBuilder(year, await getCookie(), false);
        posibilities = await osirisPosibilitiesBuilder.buildPosibilities();
        fs.writeFileSync(`./current-posibilities-${year}.json`, JSON.stringify(posibilities));
    }

    await downloadPosibilities(year, posibilities, skip);

    console.log("End of download");
} 


(async () => {
    const osirisPuppeteer = new OsirisPuppeteer(OSIRIS_EMAIL, OSIRIS_PASSWORD, OSIRIS_URL);

    // await startExtractOsiris(year);
    await osirisPuppeteer.extractDossiers(year);
})();
