import { errorMessageStore, errorStore } from "$lib/store/genericError.store";
import StaticError from "$lib/errors/StaticError";
import type { ErrorAlertContent } from "$lib/entities/ErrorAlertContent";

export class ErrorService {
    defaultErrorAlertContent: ErrorAlertContent = {
        title: "Un incident technique est survenu.",
        message:
            "Merci de réessayer ultérieurement. Si le problème continue, vous pouvez recharger la page ou contacter notre support via Crisp.",
    };

    handleError(error: StaticError | Error | unknown) {
        if (error instanceof StaticError) {
            if (error.data && error.data.code === 500) {
                errorMessageStore.set(this.defaultErrorAlertContent);
            } else {
                errorMessageStore.set({
                    title: `erreur ${error?.data.code ?? error.httpCode}`,
                    message: error.message,
                });
            }
        } else {
            errorMessageStore.set(this.defaultErrorAlertContent);
        }

        this.showError();
    }

    private showError() {
        errorStore.set(true);
    }

    clearError() {
        errorStore.set(false);
    }
}

const errorService = new ErrorService();

export default errorService;
