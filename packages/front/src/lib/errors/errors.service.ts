import HttpError from "./HttpError";
import { ConflictError, NotFoundError, UnauthorizedError, BadRequestError } from "./index";
import axios from "axios";

export class ErrorsService {
    axiosErrorToError(error: Error) {
        const errorMap = new Map<number, typeof HttpError>([
            [400, BadRequestError],
            [401, UnauthorizedError],
            [404, NotFoundError],
            [409, ConflictError],
        ]);

        if (!axios.isAxiosError(error) || !error.response) throw error;

        const classError = errorMap.get(error.response.status) ?? this.buildUnknownError(error.response.status);
        return new classError(error.response.data, error);
    }

    private buildUnknownError(status) {
        return class extends HttpError {
            httpCode = status;

            constructor(data, error) {
                super(data, error);
                console.error(`HTTP ERROR ${status} is not implemented`);
            }
        };
    }
}

const errorsService = new ErrorsService();
export default errorsService;
