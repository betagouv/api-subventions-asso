require("dotenv/config"); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

const fs = require("fs");
const OsirisExtractDownloader = require("./Osiris/OsirisExtractDownloader");
const OsirisPosibilitiesBuilder = require("./Osiris/OsirisPosibilitiesBuilder");
const OsirisPuppeteer = require("./OsirisPuppeteer/OsirisPuppeteer");

const OSIRIS_URL = process.env.OSIRIS_URL || "https://osiris.extranet.jeunesse-sports.gouv.fr/";
const OSIRIS_EMAIL = process.env.OSIRIS_EMAIL || "";
const OSIRIS_PASSWORD = process.env.OSIRIS_PASSWORD || "";
const year = process.argv[2] || new Date().getFullYear().toString();
const reportName = process.argv[3] || "SuiviDossiers"; // or "SuiviActions"

async function getCookie() {
    console.log("Getting cookies");
    const osirisPuppeteer = new OsirisPuppeteer(OSIRIS_EMAIL, OSIRIS_PASSWORD, OSIRIS_URL);

    const cookies = await osirisPuppeteer.connect();
    console.log("Cookies were found");

    return cookies;
}

async function downloadPosibilities(year, posibilities, i) {
    if (!this.downloader) {
        console.log("Connect osiris extract downloader");
        this.downloader = new OsirisExtractDownloader(await getCookie(), year, reportName, false);
        await this.downloader.loadPromise;
        await new Promise(r => setTimeout(r), 1000);
        console.log("Downloader as init");
    } else if (this.downloader.year != year) {
        this.downloader.year = year;
    }
    const posibility = posibilities[i];

    if (!posibility) return;

    try {
        console.log(`Start to download ${i}/${posibilities.length}`);

        await this.downloader.download(posibility, getCookie);
        console.log(`End to download ${i}/${posibilities.length}`);

        return await downloadPosibilities(year, posibilities, Number(i) + 1);
    } catch (e) {
        console.log(e);
        // Retry download but restart downloader
        this.downloader = null;
        console.log("Error retry to download current posibility");
        await new Promise(r => setTimeout(r), 1000 * 60 * 10); // 10min for wait osiris restart;
        return await downloadPosibilities(year, posibilities, i);
    }
}

async function startExtractOsiris(year, reportName) {
    let posibilities = [];
    const posibilitiesFileName = `./current-posibilities-${year}-${reportName}.json`;
    if (fs.existsSync(posibilitiesFileName)) {
        posibilities = JSON.parse(fs.readFileSync(posibilitiesFileName, { encoding: "utf-8" }));
    } else {
        const osirisPosibilitiesBuilder = new OsirisPosibilitiesBuilder(year, reportName, await getCookie(), false);
        posibilities = await osirisPosibilitiesBuilder.buildPosibilities();
        fs.writeFileSync(posibilitiesFileName, JSON.stringify(posibilities));
    }

    let skip = 0;
    const folderDownload = `./extract/${year}/${reportName}/`;
    if (fs.existsSync(folderDownload)) {
        const files = fs.readdirSync(folderDownload);
        skip = files.length > 0 ? files.length - 1 : 0;
    }

    await downloadPosibilities(year, posibilities, skip);

    console.log("End of download");
}

(async () => {
    // const osirisPuppeteer = new OsirisPuppeteer(OSIRIS_EMAIL, OSIRIS_PASSWORD, OSIRIS_URL);
    if (/\d{4}-\d{4}/.test(year)) {
        const [_, firstOccurence, lastOccurence] = year.match(/(\d{4})-(\d{4})/);
        const start = Math.min(firstOccurence, lastOccurence);
        const end = Math.max(firstOccurence, lastOccurence);

        for (let i = start; i <= end; i++) {
            console.log("start extract year:", i);
            await startExtractOsiris(i, reportName);
        }
    } else {
        await startExtractOsiris(year, reportName);
    }
    process.exit();
    // await osirisPuppeteer.extractDossiers(year);
})();
