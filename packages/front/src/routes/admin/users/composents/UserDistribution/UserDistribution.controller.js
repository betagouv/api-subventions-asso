import Chart from "chart.js/auto";
import Store from "$lib/core/Store";
import statsService from "$lib/resources/stats/stats.service";

export default class UserDistributionController {
    constructor() {
        this._canvas = null;
        this._chart = null;
        this.distributions = new Store(this._buildDataDefaultValue());
    }

    async init() {
        const result = await statsService.getUsersDistribution();
        this.distributions.value.forEach(distribution => {
            if (result[distribution.name]) distribution.value = result[distribution.name];
        });
    }

    set canvas(canvas) {
        if (!canvas) return;
        this._canvas = canvas;
        this._update();
    }

    _buildDataDefaultValue() {
        return [
            {
                name: "admin",
                value: 0,
                label: "Administrateurs",
                color: "#fef3fd", // --background-alt-purple-glycine
            },
            {
                name: "active",
                value: 0,
                label: "Utilisateurs actifs (hors admin)",
                color: "#dee5fd", // --background-action-low-blue-ecume
            },
            {
                name: "idle",
                value: 0,
                label: "Utilisateurs non actifs (hors admin)",
                color: "#3558a2", // --background-action-high-blue-cumulus
            },
            {
                name: "inactive",
                value: 0,
                label: "Utilisateurs n'ayant pas activé leurs comptes (hors admin)",
                color: "#fef4f3", // --background-alt-pink-tuile
            },
        ];
    }

    _update() {
        this._chart = new Chart(this._canvas, {
            type: "pie",
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false,
                    },
                },
            },
            data: {
                labels: this.distributions.value.map(distribution => distribution.label),
                datasets: [
                    {
                        label: "Utilisateurs",
                        data: this.distributions.value.map(distribution => distribution.value),
                        backgroundColor: this.distributions.value.map(distribution => distribution.color),
                    },
                ],
            },
        });
    }
}
