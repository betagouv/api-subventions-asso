import { depositLogStore } from "$lib/store/depositLog.store";
import { stringify } from "csv-stringify/browser/esm/sync";

export default class BlockingErrorsController {
    async downloadErrorFile() {
        const depositLog = depositLogStore.value!;
        const fileInfos = depositLog.uploadedFileInfos!;

        const csvErrors = stringify(fileInfos.errors, {
            header: true,
            quoted: true,
            quoted_empty: true,
        });

        const blob = new Blob([csvErrors], { type: "text/csv; charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileInfos.fileName}.csv-errors.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    }
}
