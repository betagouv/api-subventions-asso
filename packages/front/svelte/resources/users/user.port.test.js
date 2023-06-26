import userPort from "./user.port";
import requestsService from "@services/requests.service";
jest.mock("@services/requests.service");

describe("UserPort", () => {
    describe("deleteSelfUser()", () => {
        it("calls delete route", async () => {
            requestsService.delete.mockImplementationOnce(async () => ({}));
            await userPort.deleteSelfUser();
            expect(requestsService.delete).toBeCalledTimes(1);
        });
    });
});
