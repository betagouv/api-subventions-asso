import StaticError from "./StaticError";
import { ConflictError, NotFoundError, UnauthorizedError, BadRequestError } from "./index";

export class ErrorsService {
    axiosErrorToError(e) {
        if (!e.isAxiosError) throw e;
        switch (e.response?.status) {
            case UnauthorizedError.httpCode:
                return UnauthorizedError;
            case BadRequestError.httpCode:
                return BadRequestError;
            case NotFoundError.httpCode:
                return NotFoundError;
            case ConflictError.httpCode:
                return ConflictError;
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
