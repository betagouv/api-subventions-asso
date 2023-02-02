import Chart from "chart.js/auto";
import { STATS_YEAR_CHOICES } from "@helpers/dateHelper";
import Store from "@core/Store";

export class MonthlyGraphController {
    /**
     * initializes monthly graph controller
     * @param  {(year: number) => Promise<{ aggregateStats: { message: string, value: number | string }[], monthlyData: number[] }>} loadData
     * @param {string} title
     */
    constructor(loadData, title = "", withPreviousValue = false) {
        if (!loadData) console.error("MonthlyGraph expects a function to load data");
        this.loadData = year => loadData(year); // ensure we have the right "this"
        this.title = title;
        this.withPreviousValue = withPreviousValue;
        this.dataPromise = new Store(Promise.resolve());

        this._monthData = [];
        this.yearOptions = STATS_YEAR_CHOICES.map(year => ({ value: year, label: year }));

        this.year = new Store(new Date().getFullYear());
    }

    init() {
        return this._load(this.year.value);
    }

    async _load(year) {
        this.dataPromise.set(this.loadData(year));
        const data = await this.dataPromise.value;
        this._monthData = data.monthlyData;
    }

    async onCanvasMount(canvas) {
        this.chart = this._buildChart(canvas);
    }

    async updateYear(newYearIndex) {
        await this._load(STATS_YEAR_CHOICES[newYearIndex]);
        this.chartData = this._monthData;
        this.chart.update();
    }

    set chartData(newData) {
        this.chart.data.datasets[0].data = newData;
    }

    _buildChart(canvas) {
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 288);
        gradient.addColorStop(0, "#ADBFFC");
        gradient.addColorStop(1, "white");

        const labels = [...Array(12).keys()].map(monthId =>
            new Date(2022, monthId, 1).toLocaleDateString(`fr`, { month: `narrow` })
        );
        if (this.withPreviousValue) labels.splice(0, 0, "");

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
                        label: this.title,
                        data: this._monthData,
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
