import Chart from "chart.js/auto";
import Store from "@core/Store";
import statsService from "@resources/stats/stats.service";

export default class UserDistributionController {
    constructor() {
        this._canvas = null;
        this._chart = null;
        this.admin = new Store(0);
        this.idle = new Store(0);
        this.active = new Store(0);
        this.inactive = new Store(0);
    }

    async init() {
        const result = await statsService.getUsersDistribution();
        this.admin.set(result.admin);
        this.active.set(result.active);
        this.idle.set(result.idle);
        this.inactive.set(result.admin);
    }

    set canvas(canvas) {
        if (!canvas) return;
        this._canvas = canvas;
        this._update();
    }

    _update() {
        this._chart = new Chart(this._canvas, {
            type: "pie",
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            },
            data: {
                labels: [
                    "Administrateurs",
                    "Utilisateurs actif (hors admin)",
                    "Utilisateurs non actifs (hors admin)",
                    "Utilisateurs n'ayant pas activer leurs comptes (hors admin)"
                ],
                datasets: [
                    {
                        label: "Utilisateurs",
                        data: [this.admin.value, this.active.value, this.idle.value, this.inactive.value],
                        backgroundColor: ["#fef3fd", "#dee5fd", "#3558a2", "#fef4f3"]
                    }
                ]
            }
        });
    }
}
