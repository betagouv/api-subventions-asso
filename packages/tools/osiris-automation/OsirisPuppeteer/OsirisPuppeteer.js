const fs = require('fs');
const puppeteer = require('puppeteer');


class OsirisPuppeteer {

    constructor(userEmail, userPassword, osirisUrl) {
        this.userEmail = userEmail;
        this.userPassword = userPassword;
        this.osirisUrl = osirisUrl;

        this.loadPromise = this._loadPuppeteer();

        this.onPageLoadInit = false;
        this.onPageLoadCallbacks = [];
    }

    _loadPuppeteer() {
        return new Promise(async resolve => {
            this.browser = await puppeteer.launch({ headless: true });
            this.page = await this.browser.newPage();
            await this.page.goto(this.osirisUrl);

            resolve();
        })
    }

    async connect() {
        await this.loadPromise;

        if (this.page.url() === this.osirisUrl) { // We are on home this.page, so we are connected
            return this.page.cookies();
        }
    
        if (this.page.url().includes("/Login/Identification")) { // We are on login this.page
            await this.page.evaluateHandle((email, password) => {
                // This is executed in browser
                const submitElement = document.querySelectorAll("input[value='Se connecter']")[0];
                const emailElement = document.getElementById("Identifiant");
                const passwordElement = document.getElementById("MotDePasse");
    
                emailElement.value = email;
                passwordElement.value = password;
    
                submitElement.click();
            }, this.userEmail, this.userPassword);
    
            await this.__waitPageLoad();
            // check if we are in home this.page or in login this.page
            if (this.page.url() === this.osirisUrl) { // We are on home this.page, so we are connected
                return this.page.cookies();
            }
            throw new Error("Nous n'arrivons pas à accéder au service");
        }
    
        throw new Error("Nous n'arrivons pas à accéder au service");
    }

    close() {
        return this.browser.close()
    }
    

    __waitPageLoad() {
        if (!this.onPageLoadInit) this.__onPageLoadInit();
        return new Promise((resolve) => {
            this.onPageLoadCallbacks.push(resolve);
        })
    }

    __onPageLoadInit() {
        this.onPageLoadInit = true;
        this.page.on("load", () => {
            this.onPageLoadCallbacks.forEach(cb => cb());
            this.onPageLoadCallbacks.length = 0;
        });
    }


    /**
     * This part is not used, but their is an other solution for get osiris extract
     */

    async extractDossiers(year) {
        const route = "Statistique/SuiviActionDossier";
        
        const managerDownloadsInterval = await __startManageDownloads(page);
    
        await this.page.goto(this.osirisUrl + route);
    
        await this.page.evaluateHandle(browserScript, year);
    
        clearInterval(managerDownloadsInterval);
        console.log("ENDED");
    }

    async __startManageDownloads() {
        const downloadPath = './extract';
        this.__clearDir(downloadPath);
        await this.page._client().send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath });
    
        let lastNumberOfFiles = 0;
    
        return setInterval(async () => {
            const filesInFolders = await fs.promises.readdir(downloadPath);
            if (lastNumberOfFiles === filesInFolders.length || filesInFolders.find(f => f.includes('.crdownload'))) return;
    
            lastNumberOfFiles = filesInFolders.length;
            await this.__wait();
            this.page.evaluateHandle(() =>  window.onFileDowloadEnded && window.onFileDowloadEnded());
        }, 1000);
    }

    __clearDir(dirPath) {
        fs.readdir(dirPath, (err, files) => {
            if (err) throw err;
            for (const file of files) {
                fs.unlink(path.join(dirPath, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
    
    __wait(time = 1000) {
        return new Promise((r) => {
            setTimeout(r, time);
        })
    }
    
    
}

module.exports = OsirisPuppeteer;