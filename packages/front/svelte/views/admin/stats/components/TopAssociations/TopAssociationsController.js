import Store from "@core/Store";
import statisticsService from "@resources/statistics/statistics.service";
import { computeSameDateInPreviousYear } from "@helpers/dateHelper";

export default class TopAssociationsController {
    constructor(limit = 5) {
        this.topAssociations = new Store([]);

        this._startDate = computeSameDateInPreviousYear(new Date());
        this._limit = limit;

        this.startDateYear = this._startDate.getFullYear();
        this.startDateMonth = this._startDate.toLocaleString("default", { month: "short" });
    }

    async init() {
        await this._updateTopAssociations();
    }

    async _updateTopAssociations() {
        const topAssociations = await statisticsService.getTopAssociations(this._limit);
        this.topAssociations.set(topAssociations);
    }
}
