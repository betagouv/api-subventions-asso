import Chart from "chart.js/auto";
import { STATS_YEAR_CHOICES } from "@helpers/dateHelper";
import Store from "@core/Store";

export class MonthlyGraphController {
    /**
     * initializes monthly graph controller
     * @param  {(year: number) => Promise<{ aggregateStats: { message: string, value: number | string }[], monthlyData: number[] }>} loadData
     * @param {string} title
     * @param {string} resourceName
     * @param {boolean } withPreviousValue does label have empty value before month initials
     */
    constructor(loadData, title = "", resourceName = "", withPreviousValue = false) {
        if (!loadData) throw "MonthlyGraph expects a function to load data";
        this.loadData = year => loadData(year); // ensure we have the right "this"
        this.title = title;
        this.resourceName = resourceName;
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
        // maintain "dark mode" support
        const blue = window
            .getComputedStyle(document.documentElement, null)
            .getPropertyValue("--background-contrast-blue-ecume-active");
        const white = window
            .getComputedStyle(document.documentElement, null)
            .getPropertyValue("--background-default-grey");
        gradient.addColorStop(0, blue);
        gradient.addColorStop(1, white);

        const labels = [...Array(12).keys()].map(monthId =>
            new Date(2022, monthId, 1).toLocaleDateString(`fr`, { month: `narrow` })
        );
        if (this.withPreviousValue) labels.unshift("");

        return new Chart(canvas, {
            type: "line",
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: "nearest",
                    axis: "x",
                    intersect: false
                },
                plugins: {
                    tooltip: {
                        intersect: false,
                    },
                    legend: { display: false }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: { ticks: { precision: 0 } }
                }
            },
            data: {
                labels,
                datasets: [
                    {
                        label: this.resourceName,
                        data: this._monthData,
                        borderColor: blue,
                        backgroundColor: gradient,
                        fill: true,
                        cubicInterpolationMode: "monotone",
                        tension: 0.4,
                        pointStyle: false
                    }
                ]
            }
        });
    }
}
