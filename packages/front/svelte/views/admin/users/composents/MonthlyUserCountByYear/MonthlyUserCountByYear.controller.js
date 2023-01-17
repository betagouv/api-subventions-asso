import Chart from "chart.js/auto";
import statsService from "../../../../../resources/stats/stats.service";
import { YEAR_CHOICES } from "../../../../../helpers/dateHelper";
import Store from "../../../../../core/Store";

const TODAY = new Date();

export class MonthlyUserCountByYearController {
    constructor() {
        this._data = [];
        this.yearOptions = YEAR_CHOICES.map(year => ({ value: year, label: year }));

        this.year = new Store(TODAY.getFullYear());
        this.progress = new Store();
    }

    init() {
        return this._load(this.year.value);
    }

    async _load(year) {
        this.dataPromise = new Store(statsService.getMonthlyUserCount(year));
        this._data = await this.dataPromise.value;
        this.updateProgress();
    }

    async onCanvasMount(canvas) {
        await this.dataPromise.value;
        this.chart = this._buildChart(canvas);
    }

    async updateYear(newYearIndex) {
        await this._load(YEAR_CHOICES[newYearIndex]);
        this.chartData = Object.values(this._data);
        this.chart.update();
    }

    set chartData(newData) {
        this.chart.data.datasets[0].data = newData;
    }

    // TODO update with api improvement
    updateProgress() {
        if ([this._data.December, this._data.January].includes(undefined)) return "";
        this.progress.set(this._data.December - this._data.January);
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
