import { GeoService } from "./geo.service";
import geoRepository from "./geo.repository";

jest.mock("./geo.repository");

describe("GeoService", () => {
    let ctrl: GeoService;

    beforeAll(() => {
        ctrl = new GeoService();
    });

    describe("sendRequest", () => {
        let getSpy: jest.SpyInstance;
        const PATH = "/path";

        // @ts-expect-error -- private spy
        beforeAll(() => (getSpy = jest.spyOn(ctrl.http, "get").mockResolvedValue({})));
        afterAll(() => getSpy.mockRestore());

        it("calls get with path", async () => {
            // @ts-expect-error -- private test
            await ctrl.sendRequest(PATH);
            expect(getSpy).toHaveBeenCalledWith("https://geo.api.gouv.fr/path");
        });

        it("returns result from get", async () => {
            const expected = "RES";
            getSpy.mockResolvedValueOnce({ data: expected });
            // @ts-expect-error -- private test
            const actual = await ctrl.sendRequest(PATH);
            expect(actual).toBe(expected);
        });
    });

    describe.each`
        methodName             | path
        ${"getAllDepartments"} | ${"/departements"}
        ${"getAllRegions"}     | ${"/regions"}
    `("$methodName", ({ methodName, path }) => {
        let sendRequestSpy: jest.SpyInstance;

        // @ts-expect-error -- private spy
        beforeAll(() => (sendRequestSpy = jest.spyOn(ctrl, "sendRequest").mockResolvedValue([])));
        afterAll(() => sendRequestSpy.mockRestore());

        it("calls sendRequest with proper path", async () => {
            await ctrl[methodName]();
            expect(sendRequestSpy).toHaveBeenCalledWith(path);
        });

        it("returns result from sendRequest", async () => {
            const expected = "RES";
            sendRequestSpy.mockResolvedValueOnce(expected);
            const actual = await ctrl[methodName]();
            expect(actual).toBe(expected);
        });
    });

    describe("generateAndSaveEntities", () => {
        let getDepartmentSpy: jest.SpyInstance, getRegionsSpy: jest.SpyInstance;

        beforeAll(() => {
            getDepartmentSpy = jest.spyOn(ctrl, "getAllDepartments").mockResolvedValue([
                {
                    nom: "dep1",
                    code: "1",
                    codeRegion: "1",
                },
                {
                    nom: "dep2",
                    code: "2",
                    codeRegion: "1",
                },
            ]);
            getRegionsSpy = jest.spyOn(ctrl, "getAllRegions").mockResolvedValue([
                {
                    nom: "bigRegion",
                    code: "1",
                },
                {
                    nom: "smallRegion",
                    code: "2",
                },
            ]);
        });
        afterAll(() => {
            getDepartmentSpy.mockRestore();
            getRegionsSpy.mockRestore();
        });

        it("gets all departments", async () => {
            await ctrl.generateAndSaveEntities();
            expect(getDepartmentSpy).toHaveBeenCalled();
        });

        it("gets all regions", async () => {
            await ctrl.generateAndSaveEntities();
            expect(getRegionsSpy).toHaveBeenCalled();
        });

        it("empties geo collection", async () => {
            await ctrl.generateAndSaveEntities();
            expect(geoRepository.deleteAll).toHaveBeenCalled();
        });

        it("inserts merged entities", async () => {
            await ctrl.generateAndSaveEntities();
            const actual = jest.mocked(geoRepository.insertMany).mock.calls?.[0]?.[0];
            expect(actual).toMatchSnapshot();
        });
    });

    describe("getRegionFromDepartement", () => {
        const LABEL = "00 - department";
        const NAME = "department";

        it("returns undefined if falsy arg", async () => {
            // @ts-expect-error -- test error case
            const actual = await ctrl.getRegionFromDepartment(null);
            expect(actual).toBeUndefined();
        });

        it("returns undefined if arg doesn't match regex", async () => {
            const actual = await ctrl.getRegionFromDepartment("ratata");
            expect(actual).toBeUndefined();
        });

        it("calls repo with name from arg", async () => {
            await ctrl.getRegionFromDepartment(LABEL);
            expect(geoRepository.findByDepartmentName).toHaveBeenCalledWith(NAME);
        });

        it("returns region name", async () => {
            const expected = "REGION_NAME";
            // @ts-expect-error -- mock
            jest.mocked(geoRepository.findByDepartmentName).mockResolvedValueOnce({ regionName: expected });
            const actual = await ctrl.getRegionFromDepartment(LABEL);
            expect(actual).toBe(expected);
        });
    });
});
