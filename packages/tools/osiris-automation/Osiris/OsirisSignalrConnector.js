/* eslint-env jquery */

const axios = require("axios");

require("./jQueryNodeLoader");

window._origin = "https://osiris.extranet.jeunesse-sports.gouv.fr";
window.EventSource = require("eventsource");

require("../cleaned_modules/signalR/jquery.signalR");

class OsirisSignalrConnector {
    constructor(cookies, debug = false) {
        // eslint-disable-next-line no-undef -- jquery stuff
        this.connection = $.hubConnection(`${window._origin}/OsirisSignalr/signalr`, { useDefaultPath: false });
        this.reportHubProxy = this.connection.createHubProxy("reporthub");
        this.connection.reconnectDelay = 1;
        this.connection.transportConnectTimeout = 3000;
        this.connection.reconnecting(() => {
            console.log("SignalR trying reconnecting");
        });
        this.connection.connectionSlow(() => {
            console.log("SignalR connection slow");
        });
        this.connection.error(e => {
            // console.log("SignalR error :", e);
            this.errorCallbacks.forEach(cb => cb(e));
        });
        this.connection.stateChanged(oldState => {
            console.log(oldState);
        });
        this.connection.disconnected(() => {
            console.log("Disconnected beacause : " + this.connection.lastError.message);
            setTimeout(() => {
                console.log("Trying reconnection");
                this.connect();
            }, 5000);
        });

        this.debug = debug;
        this.connectionCookies = cookies;
        this.connection.logging = debug;
        this.statusCallbacks = [];
        this.contentCallbacks = [];
        this.errorCallbacks = [];

        this.reportHubProxy.on("reportStatus", result => {
            if (debug) {
                console.log("Recieved status :", result);
            }

            this.statusCallbacks.forEach(cb => cb(result));
        });

        this.reportHubProxy.on("reportContent", result => {
            if (debug) {
                console.log("Recieved content :", result);
            }

            this.contentCallbacks.forEach(cb => cb(result));
        });
    }

    async connect() {
        if (this.debug) console.log("Connection to SignalR");
        await this.connection.start();
        if (this.debug) console.log("Connected");

        if (this.debug) console.log("Login in progress ...");

        try {
            console.log("Getting token");
            const result = await axios.default.request({
                url: `${window._origin}/Login/GetSignalrToken`,
                headers: {
                    Cookie: this.connectionCookies.map(c => `${c.name}=${c.value};`).join(" "),
                },
                method: "POST",
            });
            console.log("Token as found");
            await this.reportHubProxy.invoke("login", result.data.Token);
            if (this.debug) console.log("Successfully logged");
        } catch (e) {
            console.log(e);
        }
    }

    onStatus(callback) {
        this.statusCallbacks.push(callback);
    }

    onContent(callback) {
        this.contentCallbacks.push(callback);
    }

    onError(callback) {
        this.errorCallbacks.push(callback);
    }
}

module.exports = OsirisSignalrConnector;
