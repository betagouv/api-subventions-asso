import geoPort from "./geo.port";
import requestsService from "$lib/services/requests.service";
vi.mock("$lib/services/requests.service");

describe("GeoPort", () => {
    describe("getRegions()", () => {
        it("should call requestService.get()", async () => {
            await geoPort.getRegions();
            expect(requestsService.get).toHaveBeenCalledTimes(1);
        });
    });

    describe("getDepartements()", () => {
        it("should call requestService.get()", async () => {
            await geoPort.getDepartments();
            expect(requestsService.get).toHaveBeenCalledTimes(1);
        });
    });
});
