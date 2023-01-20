import Chart from "chart.js/auto";
import statsService from "../../../../../resources/stats/stats.service";
import { monthCapitalizedFromId, STATS_YEAR_CHOICES } from "../../../../../helpers/dateHelper";
import Store from "../../../../../core/Store";

const TODAY = new Date();

export class MonthlyUserCountByYearController {
    constructor() {
        this._monthData = [];
        this._lastYearNbUser = 0;
        this.yearOptions = STATS_YEAR_CHOICES.map(year => ({ value: year, label: year }));

        this.year = new Store(TODAY.getFullYear());
        this.progress = new Store(0);
        this.message = new Store("");
    }

    init() {
        return this._load(this.year.value);
    }

    async _load(year) {
        this.dataPromise = new Store(statsService.getMonthlyUserCount(year));
        const data = await this.dataPromise.value;
        this._monthData = data.evol_nb_users_by_month;
        this._lastYearNbUser = data.nb_users_before_year;
        this.updateProgress();
    }

    async onCanvasMount(canvas) {
        this.chart = this._buildChart(canvas);
    }

    async updateYear(newYearIndex) {
        await this._load(STATS_YEAR_CHOICES[newYearIndex]);
        this.chartData = Object.values(this._monthData);
        this.chart.update();
    }

    set chartData(newData) {
        this.chart.data.datasets[0].data = newData;
    }

    updateProgress() {
        if (!this._monthData) return;

        if (this.year.value === TODAY.getFullYear()) {
            this.progress.set(this._monthData[monthCapitalizedFromId(TODAY.getMonth())] - this._lastYearNbUser);
            this.message.set(`depuis janvier ${this.year.value}`);
            return;
        }
        this.progress.set(this._monthData.December - this._lastYearNbUser);
        this.message.set(`en ${this.year.value}`);
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
                // TODO change with api format #908
                labels: Object.keys(this._monthData).map(fullMonth =>
                    new Date(Date.parse(fullMonth + " 1, 2022")).toLocaleDateString(`fr`, { month: `narrow` })
                ),
                datasets: [
                    {
                        label: "Utilisateurs",
                        data: Object.values(this._monthData),
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
