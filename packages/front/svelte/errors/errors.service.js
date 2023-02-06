import UnauthoziedError from "./UnauthorizedError";

export class ErrorsService {
    axiosErrorToError(e) {
        if (!e.isAxiosError) return Error;
        switch (e.response.status) {
            case UnauthoziedError.httpCode:
                return UnauthoziedError;
        }

        return Error;
    }
}

const errorsService = new ErrorsService();
export default errorsService;
