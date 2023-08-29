import { ApplicationStatus } from "dto";

export class StatusLabelController {
    static cssClassByLabel = {
        [ApplicationStatus.GRANTED]: "fr-badge--success",
        [ApplicationStatus.REFUSED]: "fr-badge--error",
        [ApplicationStatus.PENDING]: "fr-badge--info",
        [ApplicationStatus.INELIGIBLE]: "fr-badge--warning fr-badge--beige-gris-galet",
    };

    /**
     * @param label: ApplicationStatus
     */
    constructor(label) {
        this.label = label;
        this.classes = StatusLabelController.cssClassByLabel[label] || "";
    }
}
