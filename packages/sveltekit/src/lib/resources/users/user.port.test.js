import userPort from "./user.port";
import requestsService from "$lib/services/requests.service";
jest.mock("$lib/services/requests.service");

describe("UserPort", () => {
    describe("deleteSelfUser()", () => {
        it("calls delete route", async () => {
            requestsService.delete.mockImplementationOnce(async () => ({}));
            await userPort.deleteSelfUser();
            expect(requestsService.delete).toBeCalledTimes(1);
        });
    });
});
