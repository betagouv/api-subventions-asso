import NotifyImportFailureUseCase, {
    notifyImportFailureUseCase,
    type ImportFailurePayload,
} from "../../../../modules/notify/use-cases/notify-import-failure.use-case";
import NotifyImportSuccessUseCase, {
    notifyImportSuccessUseCase,
    type ImportSuccessPayload,
} from "../../../../modules/notify/use-cases/notify-import-success.use-case";

export class ImportNotifier {
    constructor(
        private success: NotifyImportSuccessUseCase,
        private failure: NotifyImportFailureUseCase,
    ) {}

    notifySuccess(payload: ImportSuccessPayload) {
        this.success.execute(payload);
    }

    notifyFailure(payload: ImportFailurePayload) {
        this.failure.execute(payload);
    }
}

const importNotifier = new ImportNotifier(notifyImportSuccessUseCase, notifyImportFailureUseCase);
export default importNotifier;
