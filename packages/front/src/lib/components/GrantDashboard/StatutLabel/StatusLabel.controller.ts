import { ApplicationStatus } from "dto";

export class StatusLabelController {
    static cssClassByLabel = {
        [ApplicationStatus.GRANTED]: "fr-badge--success",
        [ApplicationStatus.REFUSED]: "fr-badge--error",
        [ApplicationStatus.PENDING]: "fr-badge--info",
        [ApplicationStatus.INELIGIBLE]: "fr-badge--warning fr-badge--beige-gris-galet",
    };

    public label: string;
    public classes: string[];

    /**
     * @param label: ApplicationStatus
     */
    constructor(label: string) {
        this.label = label;
        this.classes = StatusLabelController.cssClassByLabel[label] || "";
    }
}
