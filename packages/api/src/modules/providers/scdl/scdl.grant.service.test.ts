import miscScdlJoiner from "./repositories/miscScdl.joiner";
import scdlGrantService from "./scdl.grant.service";
import MiscScdlAdapter from "./adapters/MiscScdl.adapter";
import * as Sentry from "@sentry/node";
import MiscScdlGrantEntity from "./entities/MiscScdlGrantEntity";

jest.mock("./repositories/miscScdl.joiner");
jest.mock("./adapters/MiscScdl.adapter");
jest.mock("@sentry/node");

describe("ScdlGrantService", () => {
    const IDENTIFIER = "structIdentifier";

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

        it("returns null if error is thrown by promise", async () => {
            // @ts-expect-error tests
            const actual = await scdlGrantService.getEntityByPromiseAndAdapt(ERROR_PROMISE, ADAPTER);
            expect(actual).toBeNull();
        });

        it("captures adapter error to sentry", async () => {
            ADAPTER.mockImplementationOnce(() => {
                throw new Error(ERROR_CONTENT);
            });
            // @ts-expect-error tests
            await scdlGrantService.getEntityByPromiseAndAdapt(PROMISE, ADAPTER);
            expect(Sentry.captureException).toHaveBeenCalledWith(new Error(ERROR_CONTENT));
        });

        it("returns null if error is thrown by adapter", async () => {
            ADAPTER.mockImplementationOnce(() => {
                throw new Error(ERROR_CONTENT);
            });
            // @ts-expect-error tests
            const actual = await scdlGrantService.getEntityByPromiseAndAdapt(PROMISE, ADAPTER);
            expect(actual).toBeNull();
        });
    });

    describe.each`
        joinerMethod                  | identifierType | serviceMethodName
        ${miscScdlJoiner.findBySiret} | ${"Siret"}     | ${"getDemandeSubventionBySiret"}
        ${miscScdlJoiner.findBySiren} | ${"Siren"}     | ${"getDemandeSubventionBySiren"}
    `("getDemandeSubventionBy$identifierType", ({ joinerMethod, serviceMethodName }) => {
        it("calls joiner to get data", async () => {
            await scdlGrantService[serviceMethodName](IDENTIFIER);
            expect(joinerMethod).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("calls private method with promise from joiner", async () => {
            // @ts-expect-error tests
            const spy: jest.SpyInstance = jest.spyOn(scdlGrantService, "getEntityByPromiseAndAdapt");
            const expected = Promise.resolve(["value from joiner"]);
            jest.mocked(joinerMethod).mockReturnValueOnce(expected);
            await scdlGrantService[serviceMethodName](IDENTIFIER);
            const actual = spy.mock.calls[0][0];
            expect(actual).toEqual(expected);
        });

        it("calls private method with adapter", async () => {
            // @ts-expect-error tests
            const spy: jest.SpyInstance = jest.spyOn(scdlGrantService, "getEntityByPromiseAndAdapt");
            const expected = MiscScdlAdapter.toDemandeSubvention;
            await scdlGrantService[serviceMethodName](IDENTIFIER);
            const actual = spy.mock.calls[0][1];
            expect(actual).toEqual(expected);
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

    describe.each`
        joinerMethod                  | identifierType | serviceMethodName
        ${miscScdlJoiner.findByRna}   | ${"Rna"}       | ${"getRawGrantsByRna"}
        ${miscScdlJoiner.findBySiret} | ${"Siret"}     | ${"getRawGrantsBySiret"}
        ${miscScdlJoiner.findBySiren} | ${"Siren"}     | ${"getRawGrantsBySiren"}
    `("getRawGrantsBy$identifierType", ({ joinerMethod, serviceMethodName }) => {
        it("calls joiner to get data", async () => {
            await scdlGrantService[serviceMethodName](IDENTIFIER);
            expect(joinerMethod).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("calls private method with promise from joiner", async () => {
            // @ts-expect-error tests
            const spy: jest.SpyInstance = jest.spyOn(scdlGrantService, "getEntityByPromiseAndAdapt");
            const expected = Promise.resolve(["value from joiner"]);
            jest.mocked(joinerMethod).mockReturnValueOnce(expected);
            await scdlGrantService[serviceMethodName](IDENTIFIER);
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
});
