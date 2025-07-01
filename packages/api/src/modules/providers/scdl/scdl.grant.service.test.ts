import miscScdlJoiner from "../../../dataProviders/db/providers/scdl/miscScdl.joiner";
import scdlGrantService from "./scdl.grant.service";
import MiscScdlAdapter from "./adapters/MiscScdl.adapter";
import * as Sentry from "@sentry/node";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";
import AssociationIdentifier from "../../../identifierObjects/AssociationIdentifier";
import Rna from "../../../identifierObjects/Rna";
import Siren from "../../../identifierObjects/Siren";
import EstablishmentIdentifier from "../../../identifierObjects/EstablishmentIdentifier";
import Siret from "../../../identifierObjects/Siret";
import { ApplicationFlatEntity } from "../../../entities/ApplicationFlatEntity";
import { ReadableStream } from "node:stream/web";
import applicationFlatService from "../../applicationFlat/applicationFlat.service";
import { ScdlGrantDbo } from "./dbo/ScdlGrantDbo";
import miscScdlGrantPort from "../../../dataProviders/db/providers/scdl/miscScdlGrant.port";
import { cursorToStream } from "../../applicationFlat/applicationFlat.helper";
import { FindCursor } from "mongodb";

jest.mock("../../../dataProviders/db/providers/scdl/miscScdl.joiner", () => ({
    findByRna: jest.fn(),
    findBySiren: jest.fn(),
    findBySiret: jest.fn(),
}));
jest.mock("./adapters/MiscScdl.adapter");
jest.mock("@sentry/node");
jest.mock("../../applicationFlat/applicationFlat.service");
jest.mock("../../applicationFlat/applicationFlat.helper");
jest.mock("../../../dataProviders/db/providers/scdl/miscScdlGrant.port");

describe("ScdlGrantService", () => {
    describe("getEntityByPromiseAndAdapt", () => {
        const ENTITIES = [1, 2];
        const PROMISE = Promise.resolve(ENTITIES);
        const ERROR_CONTENT = "too bad";
        const ERROR_PROMISE = Promise.reject(new Error(ERROR_CONTENT));
        const ADAPTER = jest.fn(entity => entity.toString());

        it("calls adapter for each element in promise array result", async () => {
            // @ts-expect-error tests
            await scdlGrantService.getEntityByPromiseAndAdapt(PROMISE, ADAPTER);
            expect(ADAPTER).toHaveBeenCalledWith(ENTITIES[0]);
            expect(ADAPTER).toHaveBeenCalledWith(ENTITIES[1]);
        });

        it("captures promise error to sentry", async () => {
            // @ts-expect-error tests
            await scdlGrantService.getEntityByPromiseAndAdapt(ERROR_PROMISE, ADAPTER);
            expect(Sentry.captureException).toHaveBeenCalledWith(new Error(ERROR_CONTENT));
        });

        it("returns empty array if error is thrown by promise", async () => {
            // @ts-expect-error tests
            const actual = await scdlGrantService.getEntityByPromiseAndAdapt(ERROR_PROMISE, ADAPTER);
            expect(actual).toHaveLength(0);
        });

        it("captures adapter error to sentry", async () => {
            ADAPTER.mockImplementationOnce(() => {
                throw new Error(ERROR_CONTENT);
            });
            // @ts-expect-error tests
            await scdlGrantService.getEntityByPromiseAndAdapt(PROMISE, ADAPTER);
            expect(Sentry.captureException).toHaveBeenCalledWith(new Error(ERROR_CONTENT));
        });

        it("returns empty array if error is thrown by adapter", async () => {
            ADAPTER.mockImplementationOnce(() => {
                throw new Error(ERROR_CONTENT);
            });
            // @ts-expect-error tests
            const actual = await scdlGrantService.getEntityByPromiseAndAdapt(PROMISE, ADAPTER);
            expect(actual).toHaveLength(0);
        });
    });

    describe("getRawGrantSubventionByPromise", () => {
        const ENTITIES = [] as MiscScdlGrantEntity[];
        let mockGetEntityByPromiseAndAdapt: jest.SpyInstance;
        beforeAll(() => {
            // @ts-expect-error: private method
            mockGetEntityByPromiseAndAdapt = jest.spyOn(scdlGrantService, "getEntityByPromiseAndAdapt");
            mockGetEntityByPromiseAndAdapt.mockResolvedValue(ENTITIES);
        });

        afterAll(() => {
            mockGetEntityByPromiseAndAdapt.mockRestore();
        });

        it("should call getEntityByPromiseAndAdapt", async () => {
            const dbPromise = async () => ENTITIES;
            // @ts-expect-error: private method
            await scdlGrantService.getRawGrantSubventionByPromise(dbPromise);
            expect(mockGetEntityByPromiseAndAdapt).toHaveBeenCalledWith(dbPromise, MiscScdlAdapter.toRawApplication);
        });

        it("should return entities", async () => {
            const dbPromise = async () => ENTITIES;
            const expected = ENTITIES;
            // @ts-expect-error: private method
            const actual = await scdlGrantService.getRawGrantSubventionByPromise(dbPromise);
            expect(actual).toEqual(expected);
        });
    });

    describe.each([
        ["Rna", miscScdlJoiner.findByRna, new Rna("W123456789")],
        ["Siren", miscScdlJoiner.findBySiren, new Siren("123456789")],
        ["Siret", miscScdlJoiner.findBySiret, new Siret("12345678901234")],
    ])("getRawGrants by identifiers type %s", (type, joinerMethod, value) => {
        const IDENTIFIER =
            value instanceof Siret
                ? EstablishmentIdentifier.fromSiret(value, AssociationIdentifier.fromId(value.toSiren()))
                : AssociationIdentifier.fromId(value);

        it("calls joiner to get data", async () => {
            // @ts-expect-error tests
            jest.spyOn(scdlGrantService, "getRawGrantSubventionByPromise").mockResolvedValueOnce([]);
            await scdlGrantService.getRawGrants(IDENTIFIER);
            expect(joinerMethod).toHaveBeenCalledWith(value);
        });

        it("calls private method with promise from joiner", async () => {
            // @ts-expect-error tests
            const spy: jest.SpyInstance = jest.spyOn(scdlGrantService, "getEntityByPromiseAndAdapt");
            const expected = Promise.resolve(["value from joiner"]);
            // @ts-expect-error tests
            jest.mocked(joinerMethod).mockReturnValueOnce(expected);
            await scdlGrantService.getRawGrants(IDENTIFIER);
            const actual = spy.mock.calls[0][0];
            expect(actual).toEqual(expected);
        });
    });

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { foo: "bar" } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };

        it("should call FonjepEntityAdapter.rawToApplication", () => {
            scdlGrantService.rawToApplication(RAW_APPLICATION);
            expect(MiscScdlAdapter.rawToApplication).toHaveBeenCalledWith(RAW_APPLICATION);
        });

        it("should return DemandeSubvention", () => {
            jest.mocked(MiscScdlAdapter.rawToApplication).mockReturnValueOnce(APPLICATION);
            const expected = APPLICATION;
            const actual = scdlGrantService.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("saveDbosToApplicationFlat", () => {
        const DBOS = ["dbo1", "dbo2"] as unknown as ScdlGrantDbo[];
        const STREAM = "STREAM" as unknown as ReadableStream<ApplicationFlatEntity>;
        let convertSpy, saveSpy: jest.SpyInstance;

        beforeAll(() => {
            convertSpy = jest.spyOn(scdlGrantService, "dbosToApplicationFlatStream").mockReturnValue(STREAM);
            saveSpy = jest.spyOn(scdlGrantService, "saveFlatFromStream").mockImplementation(jest.fn());
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
        jest.mocked(MiscScdlAdapter.dboToApplicationFlat).mockImplementation(adapterMock);

        it("calls adapter for each scdlDbo", async () => {
            const res = scdlGrantService.dbosToApplicationFlatStream(DBOS);
            for await (const _chunk of res) {
                /* to empty the stream */
            }
            expect(MiscScdlAdapter.dboToApplicationFlat).toHaveBeenCalledTimes(2);
        });

        it("returns stream with flat entities", async () => {
            const resStream = scdlGrantService.dbosToApplicationFlatStream(DBOS);
            const resArray: ApplicationFlatEntity[] = [];
            for await (const chunk of resStream) resArray.push(chunk);
            expect(resArray).toEqual(["1", "2"]);
        });
    });

    describe("saveFlatFromStream", () => {
        it("saves through applicationFlat", () => {
            const STREAM = "toto" as unknown as ReadableStream<ApplicationFlatEntity>;
            scdlGrantService.saveFlatFromStream(STREAM);
            expect(applicationFlatService.saveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });

    describe("initApplicationFlat", () => {
        let spySaveFromStream: jest.SpyInstance;
        const CURSOR = "cursor" as unknown as FindCursor;
        const STREAM = "stream" as unknown as ReadableStream;

        beforeAll(() => {
            jest.mocked(miscScdlGrantPort.findAllCursor).mockReturnValue(CURSOR);
            jest.mocked(cursorToStream).mockReturnValue(STREAM);
            spySaveFromStream = jest.spyOn(scdlGrantService, "saveFlatFromStream").mockResolvedValue();
        });

        afterAll(() => {
            jest.mocked(miscScdlGrantPort.findAllCursor).mockRestore();
            jest.mocked(cursorToStream).mockRestore();
            spySaveFromStream.mockRestore();
        });

        it("get full cursor", async () => {
            await scdlGrantService.initApplicationFlat();
            expect(miscScdlGrantPort.findAllCursor).toHaveBeenCalled();
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
            expect(MiscScdlAdapter.dboToApplicationFlat).toHaveBeenCalledWith(DBO);
        });

        it("saves stream", async () => {
            await scdlGrantService.initApplicationFlat();
            expect(spySaveFromStream).toHaveBeenCalledWith(STREAM);
        });
    });
});
