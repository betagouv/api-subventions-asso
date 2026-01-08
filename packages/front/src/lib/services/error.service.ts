import { errorMessageStore, errorStore } from "$lib/store/genericError.store";
import StaticError from "$lib/errors/StaticError";
import { ErrorAlertContent } from "$lib/entities/ErrorAlertContent";

export class ErrorService {
    handleError(error: StaticError | Error | unknown) {
        if (error instanceof StaticError) {
            if (error.data && error.data.code === 500) {
                errorMessageStore.set(new ErrorAlertContent());
            } else {
                errorMessageStore.set(
                    new ErrorAlertContent(`erreur ${error?.data.code ?? error.httpCode}`, error.message),
                );
            }
        } else {
            errorMessageStore.set(new ErrorAlertContent());
        }

        this.showError();
    }

    private showError() {
        errorStore.set(true);
    }

    clearError() {
        errorStore.set(false);
        errorMessageStore.set(new ErrorAlertContent());
    }
}

const errorService = new ErrorService();

export default errorService;
