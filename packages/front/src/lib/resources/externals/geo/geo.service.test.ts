import geoPort from "./geo.port";
vi.mock("./geo.port");
import geoService from "./geo.service";

describe("geoService", () => {
    describe("getRegions()", () => {
        it("should call geoPort.getRegions()", () => {
            geoService.getRegions();
            expect(geoPort.getRegions).toHaveBeenCalledTimes(1);
        });
    });

    describe("getDepartements()", () => {
        it("should call geoPort.getDepartements()", () => {
            geoService.getDepartements();
            expect(geoPort.getDepartments).toHaveBeenCalledTimes(1);
        });
    });
});
