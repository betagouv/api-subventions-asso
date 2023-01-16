import Chart from "chart.js/auto";
import statsService from "../../../../../resources/stats/stats.service";
import { YEAR_CHOICES } from "../../../../../helpers/dateHelper";
import Store from "../../../../../core/Store";

export class MonthlyUserCountByYearController {
    constructor() {
        this._data = [];
        this.years = YEAR_CHOICES.map(year => ({ value: year, label: year }));

        this.year = new Store(new Date().getFullYear());
        this.progress = new Store();
    }

    async init() {
        this.dataPromise = new Store(statsService.getMonthlyUserCount(this.year));
        this._data = await this.dataPromise.value;
        this.progress.set(this.getProgress());
    }

    async onCanvasMount(canvas) {
        await this.dataPromise.value;
        this.chart = this._buildChart(canvas);
    }

    async updateYear(newYearIndex) {
        this.dataPromise.set(statsService.getMonthlyUserCount(YEAR_CHOICES[newYearIndex]));
        this._data = await this.dataPromise.value;
        this.progress.set(this.getProgress());
        this.chartData = Object.values(this._data);
        this.chart.update();
    }

    set chartData(newData) {
        this.chart.data.datasets[0].data = newData;
    }

    // TODO update with api improvement
    getProgress() {
        if ([this._data.December, this._data.January].includes(undefined)) return "";
        return this._data.December - this._data.January;
    }

    _buildChart(canvas) {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 288);
        gradient.addColorStop(0, "#ADBFFC");
        gradient.addColorStop(1, "white");

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
                labels: Object.keys(this._data).map(fullMonth =>
                    new Date(Date.parse(fullMonth + " 1, 2022")).toLocaleDateString(`fr`, { month: `narrow` })
                ),
                datasets: [
                    {
                        label: "Utilisateurs",
                        // TODO update with api improvement
                        data: Object.values(this._data),
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
