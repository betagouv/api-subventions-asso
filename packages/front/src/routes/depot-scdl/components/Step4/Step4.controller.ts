import Store from "$lib/core/Store";
import { depositLogStore } from "$lib/store/depositLog.store";
import { type EventDispatcher, getContext } from "svelte";
import depositLogService, { type FileValidationState } from "$lib/resources/deposit-log/depositLog.service";
import errorService from "$lib/services/error.service";

type EventMap = {
    prevStep: void;
    nextStep: void;
    loading: string;
    endLoading: void;
    restartNewForm: void;
    error: string;
};

export default class Step4Controller {
    private MIN_LOADING_TIME = 2000;
    private readonly dispatch: EventDispatcher<EventMap>;
    public view: Store<FileValidationState | "error"> = new Store("confirmDataAdd");
    app: { getContact: () => string };

    constructor(dispatch: EventDispatcher<EventMap>) {
        this.dispatch = dispatch;
        this.app = getContext("app");
        const depositLog = depositLogStore.value!;
        if (!depositLog.uploadedFileInfos) {
            this.view.set("error");
            return;
        }

        const fileInfos = depositLog.uploadedFileInfos;

        const fileValidationState = depositLogService.determineFileValidationState(
            depositLog.allocatorSiret!,
            fileInfos,
        );
        this.view.set(fileValidationState);
    }

    get contactEmail() {
        return this.app.getContact();
    }

    handlePrevStep() {
        this.dispatch("prevStep");
    }

    handleRestartNewForm() {
        this.dispatch("restartNewForm");
    }

    async submitDatas() {
        const startTime = Date.now();
        this.dispatch("loading", "Veuillez patientez, nous finalisons le dépôt de vos données");

        try {
            await depositLogService.persistScdlFile();

            const elapsed = Date.now() - startTime;
            const remainingTime = this.MIN_LOADING_TIME - elapsed;

            if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
            }

            depositLogStore.set(null);
            this.dispatch("nextStep");
        } catch (e) {
            errorService.handleError(e);
        } finally {
            this.dispatch("endLoading");
        }
    }
}
