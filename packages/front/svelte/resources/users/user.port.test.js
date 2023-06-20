import axios from "axios";
import userPort from "./user.port";
jest.mock("axios");

const DEFAULT_ERROR_CODE = 500;

describe("UserPort", () => {
    describe("deleteSelfUser()", () => {
        it("calls delete route", async () => {
            axios.delete.mockImplementationOnce(async () => ({}));
            await userPort.deleteSelfUser();
            expect(axios.delete).toBeCalledTimes(1);
        });

        it("throws error with error code if any", () => {
            const ERROR_CODE = 42;
            axios.delete.mockRejectedValueOnce({ response: { data: { code: ERROR_CODE } } });
            const expected = new Error(ERROR_CODE);
            expect(async () => userPort.deleteSelfUser()).rejects.toThrowError(expected);
        });

        it("throws error with default code if none received", () => {
            axios.delete.mockRejectedValueOnce(undefined);
            const expected = new Error(DEFAULT_ERROR_CODE);
            expect(async () => userPort.deleteSelfUser()).rejects.toThrowError(expected);
        });
    });
});
