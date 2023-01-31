import Chart from "chart.js/auto";
import statsService from "../../../../../resources/stats/stats.service";
import { STATS_YEAR_CHOICES } from "../../../../../helpers/dateHelper";
import Store from "../../../../../core/Store";

export class MonthlyUserCountByYearController {
    constructor() {
        this._monthData = [];
        this._lastYearNbUser = 0;
        this.yearOptions = STATS_YEAR_CHOICES.map(year => ({ value: year, label: year }));

        this.year = new Store(new Date().getFullYear());
        this.progress = new Store(0);
        this.message = new Store("");
    }

    init() {
        return this._load(this.year.value);
    }

    async _load(year) {
        this.dataPromise = new Store(statsService.getMonthlyUserCount(year));
        const data = await this.dataPromise.value;
        this._monthData = data.evolution_nombres_utilisateurs;
        this._lastYearNbUser = data.nombres_utilisateurs_avant_annee;
        this.updateProgress();
    }

    async onCanvasMount(canvas) {
        this.chart = this._buildChart(canvas);
    }

    async updateYear(newYearIndex) {
        await this._load(STATS_YEAR_CHOICES[newYearIndex]);
        this.chartData = [this._lastYearNbUser, ...this._monthData];
        this.chart.update();
    }

    set chartData(newData) {
        this.chart.data.datasets[0].data = newData;
    }

    updateProgress() {
        if (!this._monthData) return;

        const TODAY = new Date();
        if (this.year.value === TODAY.getFullYear()) {
            this.progress.set(this._monthData[TODAY.getMonth()] - this._lastYearNbUser);
            this.message.set(`depuis janvier ${this.year.value}`);
            return;
        }
        this.progress.set(this._monthData[this._monthData.length - 1] - this._lastYearNbUser);
        this.message.set(`en ${this.year.value}`);
    }

    _buildChart(canvas) {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 288);
        gradient.addColorStop(0, "#ADBFFC");
        gradient.addColorStop(1, "white");

        const labels = [
            "",
            ...[...Array(12).keys()].map(monthId =>
                new Date(2022, monthId, 1).toLocaleDateString(`fr`, { month: `narrow` })
            )
        ];
        const data = [this._lastYearNbUser, ...this._monthData];

        return new Chart(canvas, {
            type: "line",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { ticks: { precision: 0 } }
                }
            },
            data: {
                labels,
                datasets: [
                    {
                        label: "Utilisateurs",
                        data,
                        borderColor: "#3F49E3",
                        backgroundColor: gradient,
                        fill: true,
                        cubicInterpolationMode: "monotone",
                        tension: 0.4, // ?
                        pointStyle: false
                    }
                ]
            }
        });
    }
}
