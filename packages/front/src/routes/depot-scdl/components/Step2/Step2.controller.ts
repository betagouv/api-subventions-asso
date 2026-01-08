import type { CreateDepositScdlLogDto } from "dto";
import depositLogService from "$lib/resources/deposit-log/depositLog.service";
import { depositLogStore } from "$lib/store/depositLog.store";
import StaticError from "$lib/errors/StaticError";
import Store, { derived, ReadStore } from "$lib/core/Store";
import { isSiret } from "$lib/helpers/identifierHelper";
import errorService from "$lib/services/error.service";

export default class Step2Controller {
    private DEPOSIT_LOG_STEP = 1;
    public hasError: ReadStore<boolean>;
    public isDisabled: ReadStore<boolean>;
    public touched: Store<boolean> = new Store(false);
    public inputValue: Store<string> = new Store("");

    constructor() {
        if (depositLogStore.value?.allocatorSiret) {
            this.inputValue.set(depositLogStore.value.allocatorSiret);
        }

        this.hasError = derived([this.inputValue, this.touched], ([input, touched]) => {
            if (!input) {
                this.setTouch(false);
                return false;
            } else if (isSiret(input)) return false;
            return touched && !isSiret(input);
        });
        this.isDisabled = derived(this.inputValue, input => {
            return !isSiret(input);
        });
    }

    setTouch(bool: boolean) {
        this.touched.set(bool);
    }

    async handleValidate(): Promise<"success" | "resume" | void> {
        const data: CreateDepositScdlLogDto = {
            overwriteAlert: true,
            allocatorSiret: this.inputValue.value.replace(/\s+/g, ""), // sanitize
        };

        try {
            if (depositLogStore.value) {
                if (depositLogStore.value?.allocatorSiret !== data.allocatorSiret) {
                    const depositLog = await depositLogService.updateDepositLog(this.DEPOSIT_LOG_STEP, data);
                    depositLogStore.set(depositLog);
                }
            } else {
                const depositLog = await depositLogService.createDepositLog(data);
                depositLogStore.set(depositLog);
            }

            return "success";
        } catch (e) {
            const typedError = (e as StaticError).data as { code?: number; message?: string }; // todo : create type
            errorService.handleError(e);
            if (typedError.code === 409) {
                return "resume";
            }
        }
    }
}
