const axios = require("axios");

require("./jQueryNodeLoader");

window._origin = "https://osiris.extranet.jeunesse-sports.gouv.fr"

require("signalr");


class OsirisSignalrConnector {

    constructor(cookies, debug = false) {
        this.connection = $.hubConnection(`${window._origin}/OsirisSignalr/signalr`, { useDefaultPath: false });
        this.reportHubProxy = this.connection.createHubProxy("reporthub");

        this.debug = debug;
        this.connectionCookies = cookies;
        this.connection.logging = debug;
        this.statusCallbacks = [];
        this.contentCallbacks = [];

        this.reportHubProxy.on("reportStatus", (result) => {
            if (debug) {
                console.log("Recieved status :", result);
            }

            this.statusCallbacks.forEach(cb => cb(result));
        })

        this.reportHubProxy.on("reportContent", (result) => {
            if (debug) {
                console.log("Recieved content :", result);
            }

            this.contentCallbacks.forEach(cb => cb(result));
        })


    }

    async connect() {
        if (this.debug) console.log("Connection to SignalR");
        await this.connection.start()
        if (this.debug) console.log("Connected");

        if (this.debug) console.log("Login in progress ...");

        const result = await axios.default.request({
            url: `${window._origin}/Login/GetSignalrToken`,
            headers:{
                Cookie: this.connectionCookies.map(c => `${c.name}=${c.value};`).join(" ")
            },
            method: "POST",
        })
    
        await this.reportHubProxy.invoke('login', result.data.Token);

        if (this.debug) console.log("Successfully logged");
    }

    onStatus(callback) {
        this.statusCallbacks.push(callback);
    }

    onContent(callback) {
        this.contentCallbacks.push(callback);
    }
}

module.exports = OsirisSignalrConnector;