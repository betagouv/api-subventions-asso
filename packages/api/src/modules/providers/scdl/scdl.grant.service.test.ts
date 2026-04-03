import scdlGrantService from "./scdl.grant.service";
import MiscScdlMapper from "./mappers/misc-scdl.mapper";
import { ApplicationFlatEntity } from "../../../entities/flats/ApplicationFlatEntity";
import { ReadableStream } from "node:stream/web";
import applicationFlatService from "../../application-flat/application-flat.service";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import miscScdlGrantAdapter from "../../../adapters/outputs/db/providers/scdl/miscScdlGrant.adapter";
import { cursorToStream } from "../../application-flat/application-flat.helper";
import { FindCursor } from "mongodb";

jest.mock("../../../adapters/outputs/db/providers/scdl/miscScdl.joiner", () => ({
    findByRna: jest.fn(),
    findBySiren: jest.fn(),
    findBySiret: jest.fn(),
}));
jest.mock("./mappers/misc-scdl.mapper");
jest.mock("@sentry/node");
jest.mock("../../application-flat/application-flat.service");
jest.mock("../../application-flat/application-flat.helper");
jest.mock("../../../adapters/outputs/db/providers/scdl/miscScdlGrant.adapter");

describe("ScdlGrantService", () => {
    describe("saveDbosToApplicationFlat", () => {
        const DBOS = ["dbo1", "dbo2"] as unknown as ScdlGrantDbo[];
        const STREAM = "STREAM" as unknown as ReadableStream<ApplicationFlatEntity>;
        let convertSpy, saveSpy: jest.SpyInstance;

        beforeAll(() => {
            convertSpy = jest.spyOn(scdlGrantService, "dbosToApplicationFlatStream").mockReturnValue(STREAM);
            saveSpy = jest.spyOn(scdlGrantService, "saveApplicationsFromStream").mockImplementation(jest.fn());
        });
        afterAll(() => {
            convertSpy.mockRestore();
            saveSpy.mockRestore();
        });

        it("converts array to stream", () => {
            scdlGrantService.saveDbosToApplicationFlat(DBOS);
            expect(convertSpy).toHaveBeenCalledWith(DBOS);
        });

        it("saves flat from stream", () => {
            scdlGrantService.saveDbosToApplicationFlat(DBOS);
            expect(saveSpy).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("dbosToApplicationFlatStream", () => {
        const DBOS = ["dbo1", "dbo2"] as unknown as ScdlGrantDbo[];
        const adapterMock = jest.fn(
            (dbo: ScdlGrantDbo) => (dbo as unknown as string).slice(3, 4) as unknown as ApplicationFlatEntity,
        );
        jest.mocked(MiscScdlMapper.dboToApplicationFlat).mockImplementation(adapterMock);

        it("calls adapter for each scdlDbo", async () => {
            const res = scdlGrantService.dbosToApplicationFlatStream(DBOS);
            for await (const _chunk of res) {
                /* to empty the stream */
            }
            expect(MiscScdlMapper.dboToApplicationFlat).toHaveBeenCalledTimes(2);
        });

        it("returns stream with flat entities", async () => {
            const resStream = scdlGrantService.dbosToApplicationFlatStream(DBOS);
            const resArray: ApplicationFlatEntity[] = [];
            for await (const chunk of resStream) resArray.push(chunk);
            expect(resArray).toEqual(["1", "2"]);
        });
    });

    describe("saveApplicationsFromStream", () => {
        it("saves through applicationFlat", () => {
            const STREAM = "toto" as unknown as ReadableStream<ApplicationFlatEntity>;
            scdlGrantService.saveApplicationsFromStream(STREAM);
            expect(applicationFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("initApplicationFlat", () => {
        let spySaveFromStream: jest.SpyInstance;
        const CURSOR = "cursor" as unknown as FindCursor;
        const STREAM = "stream" as unknown as ReadableStream;

        beforeAll(() => {
            jest.mocked(miscScdlGrantAdapter.findAllCursor).mockReturnValue(CURSOR);
            jest.mocked(cursorToStream).mockReturnValue(STREAM);
            spySaveFromStream = jest.spyOn(scdlGrantService, "saveApplicationsFromStream").mockResolvedValue();
        });

        afterAll(() => {
            jest.mocked(miscScdlGrantAdapter.findAllCursor).mockRestore();
            jest.mocked(cursorToStream).mockRestore();
            spySaveFromStream.mockRestore();
        });

        it("get full cursor", async () => {
            await scdlGrantService.initApplicationFlat();
            expect(miscScdlGrantAdapter.findAllCursor).toHaveBeenCalled();
        });

        it("calls helper to generate stream", async () => {
            await scdlGrantService.initApplicationFlat();
            expect(cursorToStream).toHaveBeenCalledWith(CURSOR, expect.any(Function));
        });

        it("calls helper to generate stream with proper adapter", async () => {
            await scdlGrantService.initApplicationFlat();
            const adapterToTest = jest.mocked(cursorToStream).mock.calls[0][1];
            const DBO = "dbo" as unknown as ScdlGrantDbo;
            adapterToTest(DBO);
            expect(MiscScdlMapper.dboToApplicationFlat).toHaveBeenCalledWith(DBO);
        });

        it("saves stream", async () => {
            await scdlGrantService.initApplicationFlat();
            expect(spySaveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });
});
