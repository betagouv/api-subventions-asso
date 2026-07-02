import Siren from "../../identifier-objects/Siren";

import applicationFlatAdapter from "../../adapters/outputs/db/application-flat/application-flat.adapter";
import { ApplicationFlatService } from "./application-flat.service";
import { ApplicationFlatEntity } from "../../entities/flats/ApplicationFlatEntity";
import ApplicationFlatMapper from "./application-flat.mapper";
import { ApplicationFlatDto } from "dto";
import { ReadableStream } from "node:stream/web";

import Siret from "../../identifier-objects/Siret";
import AssociationIdentifier from "../../identifier-objects/AssociationIdentifier";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";
import { APPLICATION_LINK_TO_CHORUS, APPLICATION_FLAT_DBOS } from "./__fixtures__/application-flat.fixture";
import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";
import { GetApplications } from "./use-cases/get-applications";

jest.mock("../../adapters/outputs/db/application-flat/application-flat.adapter");
jest.mock("./application-flat.mapper");
jest.mock("../../identifier-objects/Siret");
jest.mock("../../shared/helpers/MongoHelper");

describe("ApplicationFlatService", () => {
    const APPLICATIONS = [APPLICATION_LINK_TO_CHORUS, APPLICATION_LINK_TO_CHORUS];

    const mockGetApplications = {
        execute: jest.fn().mockReturnValue(APPLICATIONS),
    } as unknown as GetApplications;
    const service = new ApplicationFlatService(mockGetApplications);

    describe("saveFromStream", () => {
        const STREAM = {} as unknown as ReadableStream;

        it("calls mongo helper", async () => {
            await service.saveFromStream(STREAM);
            expect(insertStreamByBatch).toHaveBeenCalledWith(STREAM, expect.anything(), 10000);
        });

        it("calls mongo helper with flat upsert", async () => {
            await service.saveFromStream(STREAM);
            const methodCalledByHelper = jest.mocked(insertStreamByBatch).mock.calls[0][1];
            await methodCalledByHelper([]);
            expect(applicationFlatAdapter.upsertMany).toHaveBeenCalled();
        });
    });

    describe("getApplicationDto", () => {
        const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren));

        beforeEach(() => {
            jest.mocked(ApplicationFlatMapper.toDto).mockReturnValue(
                APPLICATION_FLAT_DBOS[0] as unknown as ApplicationFlatDto,
            );
        });

        it("fetches applications flat ", async () => {
            await service.getApplicationsDto(IDENTIFIER);
            expect(mockGetApplications.execute).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("adapts entities to dtos", async () => {
            await service.getApplicationsDto(IDENTIFIER);
            expect(ApplicationFlatMapper.toDto).toHaveBeenCalledTimes(APPLICATIONS.length);
        });

        it("returns applications", async () => {
            const expected = [APPLICATION_FLAT_DBOS[0], APPLICATION_FLAT_DBOS[0]];
            const actual = await service.getApplicationsDto(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("isCollectionInitialized", () => {
        it("calls check in port", () => {
            service.isCollectionInitialized();
            expect(applicationFlatAdapter.hasBeenInitialized).toHaveBeenCalled();
        });
    });

    describe("getSiret", () => {
        beforeAll(() => {
            jest.mocked(Siret.isSiret).mockReturnValueOnce(false);
        });
        afterAll(() => {
            jest.mocked(Siret.isSiret).mockRestore();
        });

        const ENTITY = { idBeneficiaire: "123456789", typeIdBeneficiaire: "siret" } as unknown as ApplicationFlatEntity;
        it("returns undefined if typeIdBeneficiaire is not siret", () => {
            const actual = service.getSiret(ENTITY);
            expect(actual).toBeUndefined();
        });

        it("returns undefined if not siret", () => {
            jest.mocked(Siret.isSiret).mockReturnValueOnce(false);
            const actual = service.getSiret(ENTITY);
            expect(actual).toBeUndefined();
        });

        it("returns valueObject from entity", () => {
            const actual = service.getSiret(ENTITY);
            expect(actual).toMatchInlineSnapshot(`undefined`);
        });
    });

    describe("containsDataFromProvider", () => {
        const PROVIDER = "PROV";
        let mockCursorFind;

        const createAsyncIterable = <T>(items: T[]): AsyncIterable<T> => ({
            [Symbol.asyncIterator]: async function* () {
                yield* items;
            },
        });

        beforeAll(() => {
            mockCursorFind = jest.spyOn(applicationFlatAdapter, "cursorFind");
        });

        afterAll(() => {
            jest.mocked(applicationFlatAdapter.cursorFind).mockRestore();
        });

        it("gets cursor", async () => {
            mockCursorFind.mockReturnValue(createAsyncIterable([]));

            await service.containsDataFromProvider(PROVIDER);
            expect(applicationFlatAdapter.cursorFind({ provider: PROVIDER }));
        });

        it("returns true when iterable contains at least one item", async () => {
            mockCursorFind.mockReturnValue(createAsyncIterable([{} as ApplicationFlatEntity]));

            const actual = await service.containsDataFromProvider(PROVIDER);

            expect(actual).toBe(true);
        });

        it("returns false when iterable is empty", async () => {
            mockCursorFind.mockReturnValue(createAsyncIterable([]));

            const actual = await service.containsDataFromProvider(PROVIDER);

            expect(actual).toBe(false);
        });
    });

    describe("grant part", () => {
        describe("getRawGrants", () => {
            const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren("987654321"));

            it("gets entities", async () => {
                await service.getRawGrants(IDENTIFIER);
                expect(mockGetApplications.execute).toHaveBeenCalledWith(IDENTIFIER);
            });

            it("converts found methods", async () => {
                const actual = await service.getRawGrants(IDENTIFIER);
                expect(actual).toMatchSnapshot();
            });
        });
    });
});
