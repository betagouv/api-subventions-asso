import Chart from "chart.js/auto";
import Store from "@core/Store";
import statsService from "@resources/stats/stats.service";

export default class UserDistributionController {
    constructor() {
        this._canvas = null;
        this._chart = null;
        this.data = new Store(this._buildDataDefaultValue());
    }

    async init() {
        const result = await statsService.getUsersDistribution();
        this.data.value.admin.value = result.admin;
        this.data.value.active.value = result.active;
        this.data.value.idle.value = result.idle;
        this.data.value.inactive.value = result.inactive;
    }

    set canvas(canvas) {
        if (!canvas) return;
        this._canvas = canvas;
        this._update();
    }

    _buildDataDefaultValue() {
        return {
            admin: {
                value: 0,
                label: "Administrateurs",
                color: "#fef3fd" // --background-alt-purple-glycine
            },
            active: {
                value: 0,
                label: "Utilisateurs actifs (hors admin)",
                color: "#dee5fd" // --background-action-low-blue-ecume
            },
            idle: {
                value: 0,
                label: "Utilisateurs non actifs (hors admin)",
                color: "#3558a2" // --background-action-high-blue-cumulus
            },
            inactive: {
                value: 0,
                label: "Utilisateurs n'ayant pas activé leurs comptes (hors admin)",
                color: "#fef4f3" // --background-alt-pink-tuile
            }
        };
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
                    this.data.value.admin.label,
                    this.data.value.active.label,
                    this.data.value.idle.label,
                    this.data.value.inactive.label
                ],
                datasets: [
                    {
                        label: "Utilisateurs",
                        data: [
                            this.data.value.admin.value,
                            this.data.value.active.value,
                            this.data.value.idle.value,
                            this.data.value.inactive.value
                        ],
                        backgroundColor: [
                            this.data.value.admin.color,
                            this.data.value.active.color,
                            this.data.value.idle.color,
                            this.data.value.inactive.color
                        ]
                    }
                ]
            }
        });
    }
}
