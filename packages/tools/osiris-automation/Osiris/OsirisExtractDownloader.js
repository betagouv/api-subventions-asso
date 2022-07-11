const path = require("path");
const fs = require("fs");
const axios = require("axios");
const qs = require("qs");
const OsirisSignalrConnector = require("./OsirisSignalrConnector");

class OsirisExtractDownloader {
    constructor(cookie, year, debug = false) {
        this.connector = new OsirisSignalrConnector(cookie, debug);
        this.BASE_URL = "https://osiris.extranet.jeunesse-sports.gouv.fr/";
        this.connectionCookies = cookie;
        this.debug = debug;
        this.year = year;

        this.currentDownloadFileName = "";
        this.currentDownloadCallback = null;

        this.reports = [];
        this.chunks = [];

        this.connector.onStatus((...agrs) => this.__onStatus(...agrs));
        this.connector.onContent((...agrs) => this.__onContent(...agrs));

        this.__clearReportDir();
        this.loadPromise = this.connector.connect();
    }

    async download(posibility) {
        await this.loadPromise;
        if (this.currentDownloadCallback) throw new Error("Please download file one by one"); // Techniquement possible de télécharger plusieur fichiers en même temps, mais imposible de les nommés correctements

        return new Promise(async resolve => {

            this.currentDownloadFileName = this.__buildFileName(posibility);

            this.currentDownloadCallback = resolve;

            const timeout = setTimeout(() => {
                this.connector.connect();
            }, 1000 * 60 * 10 ) // 10 min

            await this.__sendExtarctOrder(posibility);

            clearTimeout(timeout);
        });
    }

    __sendExtarctOrder(posibility) {
        var url = 'Statistique/SuiviActionDossier/';
        return axios.default.request({
            url: this.BASE_URL + url,
            method: 'POST',
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: this.connectionCookies.map(c => `${c.name}=${c.value};`).join(" ")
            },
            data: qs.stringify(posibility),
        })
    }

    __buildFileName(posibility) {
        return `${posibility.Annee}-${posibility.ProgrammeTypeFinancementId}-${posibility.SousTypeFinancementId}-${posibility.ServiceId}-${posibility.IsPluriannuel}`;
    }

    __onStatus(result) {
        this.reports.push({
            ...result,
            ChunkReceived: 0
        });
    }

    __onContent(chunk) {
        if (!chunk.Part) return;

        this.chunks.push({
            ...chunk
        });

        const report = this.reports.find(report => report.Identifier == chunk.ReportId);
        if (!report) return;
        
        const chunkReceived = this.chunks.filter(p => p.ReportId == chunk.ReportId);
        report.ChunkReceived = chunkReceived.length;

        if (!chunkReceived || chunkReceived.length != chunk.ChunkCount) return;

        // File is complete
        const contentArray = new Uint8Array(report.ReportSize);
    
        chunkReceived.forEach((item) => {
            const byteArray = this.__partToArrayBuffer(item.Part);
            for (var i = item.Offset; i < item.Offset + item.ChunkSize; i++) {
                contentArray[i] = byteArray[i - item.Offset];
            }
        });

        // File has been build, so remove chunks and report of file in the memory
        this.chunks = this.chunks.filter(p => p.ReportId != report.Identifier);
        this.reports = this.reports.filter(r => r.Identifier != report.Identifier);

        this.__save(report.FileName, contentArray);
    }

    __partToArrayBuffer(base64Content) { // this code come from Osiris web page
        const binaryString = global.atob(base64Content);
        const binaryLen = binaryString.length;
        const bytes = new Uint8Array(binaryLen);
        for (let i = 0; i < binaryLen; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    }

    __save(name, byte) {
        fs.writeFile(`./extract/${this.year}/` + this.currentDownloadFileName + name, byte, (err) => err && console.error(err));
        const cb = this.currentDownloadCallback;
        this.currentDownloadCallback = null;
        cb();
    };

    __clearReportDir() {
        const dirPath = `./extract/`;
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
        }

        if (!fs.existsSync(dirPath + this.year)) {
            fs.mkdirSync(dirPath + this.year);
        }

        // fs.readdir(dirPath, (err, files) => {
        //     if (err) throw err;
        //     for (const file of files) {
        //         fs.unlink(path.join(dirPath, file), err => {
        //             if (err) throw err;
        //         });
        //     }
        // });
    }   
}

module.exports = OsirisExtractDownloader;