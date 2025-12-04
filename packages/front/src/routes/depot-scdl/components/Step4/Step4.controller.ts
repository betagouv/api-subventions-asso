import Store from "$lib/core/Store";
import { depositLogStore } from "$lib/store/depositLog.store";
import { getContext } from "svelte";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";

type EventMap = {
    prevStep: void;
    nextStep: void;
    loading: string;
    endLoading: void;
    restartNewForm: void;
    error: string;
};

type DispatchFunction = <K extends keyof EventMap>(
    type: K,
    detail?: EventMap[K] extends void ? never : EventMap[K],
) => void;

export default class Step4Controller {
    private MIN_LOADING_TIME = 2000;
    private readonly dispatch: DispatchFunction;
    public view: Store<"confirmDataAdd" | "lessGrantData" | "multipleAllocator" | "blockingErrors" | "error"> =
        new Store("confirmDataAdd");
    app: { getContact: () => string };

    constructor(dispatch: DispatchFunction) {
        this.dispatch = dispatch;
        this.app = getContext("app");
        const depositLog = depositLogStore.value!;
        if (!depositLog.uploadedFileInfos) {
            this.view.set("error");
            return;
        }

        const fileInfos = depositLog.uploadedFileInfos;

        const hasMultipleAllocators =
            fileInfos.allocatorsSiret.length > 1 || depositLog.allocatorSiret !== fileInfos.allocatorsSiret[0];
        const hasLessGrantData = fileInfos.parseableLines < fileInfos.existingLinesInDbOnSamePeriod;
        const hasBlockingErrors = fileInfos.errors.some(error => error.bloquant === "oui") ?? false;

        if (hasMultipleAllocators) {
            this.view.set("multipleAllocator");
        } else if (hasLessGrantData) {
            this.view.set("lessGrantData");
        } else if (hasBlockingErrors) {
            this.view.set("blockingErrors");
        } else {
            this.view.set("confirmDataAdd");
        }
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
            console.error("Erreur lors de l'upload du fichier", e);
            this.dispatch("endLoading");
            // todo : error handling toast
        }
    }
}
