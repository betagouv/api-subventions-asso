import { depositLogStore } from "$lib/store/depositLog.store";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

export default class BlockingErrorsController {
    async downloadErrorFile() {
        await depositLogService.downloadErrorFile(depositLogStore.value!.uploadedFileInfos!);
    }
}
