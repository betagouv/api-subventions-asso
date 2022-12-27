import Store from "@core/Store";
import statisticsService from "@resources/statistics/statistics.service";

export default class TopAssociationsController {
    constructor(endDate = new Date(), limit = 5) {
        this.topAssociations = new Store([]);

        this._startDate = this._buildStartDate(endDate);
        this._endDate = endDate;
        this._limit = limit;

        this.startDateYear = this._startDate.getFullYear();
        this.startDateMonth = this._startDate.toLocaleString("default", { month: "short" });
    }

    async load() {
        await this._updateTopAssociations();
    }

    async _updateTopAssociations() {
        const topAssociations = await statisticsService.getTopAssociations(this._limit, this._startDate, this.endDate);
        this.topAssociations.set(topAssociations);
    }

    _buildStartDate(endDate) {
        const date = new Date(endDate);
        date.setFullYear(endDate.getFullYear() - 1);
        return date;
    }
}
