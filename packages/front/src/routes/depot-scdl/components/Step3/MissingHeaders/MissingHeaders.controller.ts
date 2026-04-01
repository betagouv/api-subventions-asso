import { depositLogStore } from "$lib/store/depositLog.store";

export default class MissingHeadersController {
    public missingMandatoryHeaders: string[];
    public missingOptionalHeaders: string[];
    public allocatorSiret: string;
    public allocatorName?: string;

    constructor() {
        const depositLog = depositLogStore.value!;
        const uploadedFileInfos = depositLog.uploadedFileInfos!;
        this.missingMandatoryHeaders = uploadedFileInfos.missingHeaders.mandatory;
        this.missingOptionalHeaders = uploadedFileInfos.missingHeaders.optional;
        this.allocatorSiret = depositLog.allocatorSiret!;
        this.allocatorName = depositLog.allocatorName;
    }
}
