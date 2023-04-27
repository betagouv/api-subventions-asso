import Store from "@core/Store";
import { capitalizeFirstLetter } from "@helpers/stringHelper";

export class MonthlyGraphTooltipController {
    constructor(withPreviousValue, year) {
        this._dynamicStyle = document.createElement("span").style;
        this._withPreviousValue = withPreviousValue;
        this._year = year;

        this.style = new Store("");
        this.date = new Store("");
        this.number = new Store("");
    }

    _normalizedMonth0Index(index) {
        if (this._withPreviousValue) return index - 1;
        return index;
    }

    _dateLabel(index) {
        if (this._withPreviousValue && !index) return `Fin d'année ${this._year - 1}`;
        const normalizedIndex = this._normalizedMonth0Index(index);
        const date = new Date(this._year, normalizedIndex);
        return capitalizeFirstLetter(date.toLocaleDateString("fr", { month: "long", year: "numeric" }));
    }

    update(context) {
        const { tooltip: nativeTooltip } = context;

        // hide tooltip if it should be hidden
        if (!nativeTooltip || nativeTooltip.opacity === 0) {
            this._dynamicStyle.opacity = "0";
            this.style.set(this._dynamicStyle.cssText);
            return;
        }

        // updates data
        const dataPoint = nativeTooltip.dataPoints[0];
        this.date.set(this._dateLabel(dataPoint.dataIndex));
        this.number.set(dataPoint.raw);

        // moves and show tooltip
        this._dynamicStyle.opacity = "1";
        this._dynamicStyle.left = `${nativeTooltip.caretX}px`;
        this._dynamicStyle.top = `${nativeTooltip.caretY}px`;

        this.style.set(this._dynamicStyle.cssText);
    }
}
