import Chart from "chart.js/auto";
import statsService from "../../../../../resources/stats/stats.service";
import { YEAR_CHOICES } from "../../../../../helpers/dateHelper";

export class MonthlyUserCountByYearController {
    constructor() {
        this.data = [];
        this.years = YEAR_CHOICES.map(year => ({ value: year, label: year }));
        this.defaultYear = new Date().getFullYear();
    }

    async init() {
        this.dataPromise = statsService.getMonthlyUserCount(this.defaultYear);
        this.data = await this.dataPromise;
    }

    async onMount(canvas) {
        await this.dataPromise;
        this.chart = this._buildChart(canvas);
    }

    async updateYear(newYearIndex) {
        this.dataPromise = statsService.getMonthlyUserCount(YEAR_CHOICES[newYearIndex]);
        this.data = await this.dataPromise;
        this.chartData = this.data;
        this.chart.update();
    }

    set chartData(newData) {
        this.chart.data.datasets[0].data = newData;
    }

    // TODO update with api improvement
    get progress() {
        if (!this.data.December || !this.data.January) return undefined;
        return this.data.December - this.data.January;
    }

    _buildChart(canvas) {
        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
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
                datasets: [
                    {
                        label: "Utilisateurs",
                        data: this.data,
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
