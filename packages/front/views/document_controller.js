import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    static targets = [ "loader" , "text"];

    interval = null;

    connect() {
        document.addEventListener("turbo:before-fetch-request", () => {
            this.clearInterval();
            this.unFocus();
            this.createInterval();
            this.loaderTarget.setAttribute("style", "display: flex;");
        })
        document.addEventListener("turbo:before-render", () => {
            this.clearInterval();
            this.loaderTarget.removeAttribute("style");
        });
    }

    clearInterval() {
        if (this.interval) clearInterval(this.interval);
        this.interval = null;
    }

    createInterval() {
        this.movePoint();
        this.interval = setInterval(() => this.movePoint(), 750);
    }

    unFocus() {
        let el = document.querySelector(':focus');
        if(el) el.blur();
    }

    movePoint() {
        const totalPoint = this.textTarget.textContent.replace("Chargement en cours ", "").length;
        let text = "Chargement en cours ";

        const futurPoints = ( totalPoint ) % 4;
        for(let i = 0; i <= futurPoints; i++) { text += "."}

        this.textTarget.textContent = text;
    }
}