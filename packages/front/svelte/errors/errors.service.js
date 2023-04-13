import StaticError from "./StaticError";
import { NotFoundError, UnauthoziedError } from "./index";

export class ErrorsService {
    axiosErrorToError(e) {
        if (!e.isAxiosError) throw e;
        switch (e.response?.status) {
            case UnauthoziedError.httpCode:
                return UnauthoziedError;
            case NotFoundError.httpCode:
                return NotFoundError;
        }

        return this._buildUnknownError(e.response?.status);
    }

    _buildUnknownError(status) {
        return class extends StaticError {
            static httpCode = status;

            constructor(...args) {
                super(...args);
                console.error(`HTTP ERROR ${status} is not implemented`);
            }
        };
    }
}

const errorsService = new ErrorsService();
export default errorsService;
