import { depositLogStore } from "$lib/store/depositLog.store";

export default class MissingHeadersController {
    public missingMandatoryHeaders: string[];
    public missingOptionalHeaders: string[];

    constructor() {
        const uploadedFileInfos = depositLogStore.value!.uploadedFileInfos!;
        this.missingMandatoryHeaders = uploadedFileInfos.headerValidationResult.missingMandatory;
        this.missingOptionalHeaders = uploadedFileInfos.headerValidationResult.missingOptional;
    }
}
