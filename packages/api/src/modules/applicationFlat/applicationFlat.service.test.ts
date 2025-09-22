import Siren from "../../identifierObjects/Siren";

import applicationFlatPort from "../../dataProviders/db/applicationFlat/applicationFlat.port";
import applicationFlatService from "./applicationFlat.service";
import { ApplicationFlatEntity } from "../../entities/ApplicationFlatEntity";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";
import { DemandeSubvention } from "dto";
import { RawApplication } from "../grant/@types/rawGrant";
import { ReadableStream } from "node:stream/web";

import Siret from "../../identifierObjects/Siret";
import AssociationIdentifier from "../../identifierObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../identifierObjects/EstablishmentIdentifier";
import { FindCursor } from "mongodb";
import { insertStreamByBatch } from "../../shared/helpers/MongoHelper";
import { APPLICATION_LINK_TO_CHORUS, DBO as APPLICATION_FLAT_DBO } from "./__fixtures__";
import DEFAULT_ASSOCIATION from "../../../tests/__fixtures__/association.fixture";

jest.mock("../../dataProviders/db/applicationFlat/applicationFlat.port");
jest.mock("./ApplicationFlatAdapter");
jest.mock("../../identifierObjects/Siret");
jest.mock("../../shared/helpers/MongoHelper");

describe("ApplicationFlatService", () => {
    const APPLICATIONS = [APPLICATION_LINK_TO_CHORUS, APPLICATION_LINK_TO_CHORUS];

    describe.each`
        identifierType | rawIdentifier                  | findMethod                         | identifierConstructor
        ${"siret"}     | ${new Siret("12345678901234")} | ${applicationFlatPort.findBySiret} | ${EstablishmentIdentifier.fromSiret}
        ${"siren"}     | ${new Siren("123456789")}      | ${applicationFlatPort.findBySiren} | ${AssociationIdentifier.fromSiren}
    `("getEntitiesByIdentifier", ({ rawIdentifier, identifierConstructor, findMethod }) => {
        beforeAll(() => {
            findMethod.mockResolvedValue(APPLICATIONS);
        });
        afterAll(() => {
            findMethod.mockRestore();
        });

        it("if identifier is $identifierType, call proper port method", async () => {
            await applicationFlatService.getEntitiesByIdentifier(identifierConstructor(rawIdentifier));
            expect(findMethod).toHaveBeenCalledWith(rawIdentifier);
        });

        it("returns entities", async () => {
            const expected = APPLICATIONS;
            const actual = await applicationFlatService.getEntitiesByIdentifier(identifierConstructor(rawIdentifier));
            expect(actual).toEqual(expected);
        });
    });

    describe("saveFromStream", () => {
        const STREAM = {} as unknown as ReadableStream;

        it("calls mongo helper", async () => {
            await applicationFlatService.saveFromStream(STREAM);
            expect(insertStreamByBatch).toHaveBeenCalledWith(STREAM, expect.anything(), 10000);
        });

        it("calls mongo helper with flat upsert", async () => {
            await applicationFlatService.saveFromStream(STREAM);
            const methodCalledByHelper = jest.mocked(insertStreamByBatch).mock.calls[0][1];
            await methodCalledByHelper([]);
            expect(applicationFlatPort.upsertMany).toHaveBeenCalled();
        });
    });

    describe("getApplicationDto", () => {
        const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren(DEFAULT_ASSOCIATION.siren));

        let mockGetEntitiesByIdentifier;

        beforeEach(() => {
            mockGetEntitiesByIdentifier = jest
                .spyOn(applicationFlatService, "getEntitiesByIdentifier")
                .mockResolvedValue(APPLICATIONS);
            jest.mocked(ApplicationFlatAdapter.toDto).mockReturnValue(APPLICATION_FLAT_DBO); // dbo is the same as dto
        });

        afterAll(() => {
            mockGetEntitiesByIdentifier.mockRestore();
        });

        it("fetches applications flat ", async () => {
            await applicationFlatService.getApplicationsDto(IDENTIFIER);
            expect(mockGetEntitiesByIdentifier).toHaveBeenCalledWith(IDENTIFIER);
        });

        it("adapts entities to dtos", async () => {
            await applicationFlatService.getApplicationsDto(IDENTIFIER);
            expect(ApplicationFlatAdapter.toDto).toHaveBeenCalledTimes(APPLICATIONS.length);
        });

        it("returns applications", async () => {
            const expected = [APPLICATION_FLAT_DBO, APPLICATION_FLAT_DBO];
            const actual = await applicationFlatService.getApplicationsDto(IDENTIFIER);
            expect(actual).toEqual(expected);
        });
    });

    describe("isCollectionInitialized", () => {
        it("calls check in port", () => {
            applicationFlatService.isCollectionInitialized();
            expect(applicationFlatPort.hasBeenInitialized).toHaveBeenCalled();
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
            const actual = applicationFlatService.getSiret(ENTITY);
            expect(actual).toBeUndefined();
        });

        it("returns undefined if not siret", () => {
            jest.mocked(Siret.isSiret).mockReturnValueOnce(false);
            const actual = applicationFlatService.getSiret(ENTITY);
            expect(actual).toBeUndefined();
        });

        it("returns valueObject from entity", () => {
            const actual = applicationFlatService.getSiret(ENTITY);
            expect(actual).toMatchInlineSnapshot(`undefined`);
        });
    });

    describe("containsDataFromProvider", () => {
        const CURSOR = { hasNext: jest.fn() } as unknown as FindCursor;
        const PROVIDER = "PROV";

        beforeAll(() => {
            jest.mocked(applicationFlatPort.cursorFind).mockReturnValue(CURSOR);
        });

        afterAll(() => {
            jest.mocked(applicationFlatPort.cursorFind).mockRestore();
        });

        it("gets cursor", async () => {
            await applicationFlatService.containsDataFromProvider(PROVIDER);
            expect(applicationFlatPort.cursorFind({ provider: PROVIDER }));
        });

        it("returns response from cursor's hasNext", async () => {
            const expected = "toto" as unknown as boolean;
            jest.mocked(CURSOR.hasNext).mockResolvedValue(expected);
            const actual = await applicationFlatService.containsDataFromProvider(PROVIDER);
            expect(CURSOR.hasNext).toHaveBeenCalled();
            expect(actual).toBe(expected);
        });
    });

    // DemandeSubvention DTO
    describe("old application part", () => {
        describe("rawToApplication", () => {
            const RAW_GRANT = {
                type: "application",
                provider: "some",
                data: APPLICATION_LINK_TO_CHORUS,
                joinKey: "ej",
            } as RawApplication<ApplicationFlatEntity>;

            it("calls adapter", () => {
                applicationFlatService.rawToApplication(RAW_GRANT);
                expect(ApplicationFlatAdapter.rawToApplication).toHaveBeenCalledWith(RAW_GRANT);
            });

            it("returns adapter's result", () => {
                const expected = "adapted" as unknown as DemandeSubvention;
                jest.mocked(ApplicationFlatAdapter.rawToApplication).mockReturnValueOnce(expected);
                const actual = applicationFlatService.rawToApplication(RAW_GRANT);
                expect(actual).toBe(expected);
            });
        });

        describe("getApplication", () => {
            let getEntitiesSpy;
            const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren("987654321"));

            beforeAll(() => {
                getEntitiesSpy = jest
                    .spyOn(applicationFlatService, "getEntitiesByIdentifier")
                    .mockResolvedValue(APPLICATIONS);
            });
            afterAll(() => {
                getEntitiesSpy.mockRestore();
            });

            it("gets entities", async () => {
                await applicationFlatService.getApplication(IDENTIFIER);
                expect(getEntitiesSpy).toHaveBeenCalledWith(IDENTIFIER);
            });

            it("adapts all applications", async () => {
                await applicationFlatService.getApplication(IDENTIFIER);
                expect(ApplicationFlatAdapter.toDemandeSubvention).toHaveBeenCalledWith(APPLICATION_LINK_TO_CHORUS);
                expect(ApplicationFlatAdapter.toDemandeSubvention).toHaveBeenCalledWith(APPLICATION_LINK_TO_CHORUS);
            });

            it("returns non-null adapted applications", async () => {
                const A2 = "adapted 2" as unknown as DemandeSubvention;
                jest.mocked(ApplicationFlatAdapter.toDemandeSubvention).mockReturnValueOnce(null);
                jest.mocked(ApplicationFlatAdapter.toDemandeSubvention).mockReturnValue(A2);
                const expected = [A2];
                const actual = await applicationFlatService.getApplication(IDENTIFIER);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("grant part", () => {
        describe("getRawGrants", () => {
            let getEntitiesSpy;
            const APPLICATIONS = [
                { provider: "fonjep", paymentId: "poste1" },
                { provider: "autre", paymentId: "ej2" },
            ] as unknown as ApplicationFlatEntity[];
            const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren("987654321"));

            beforeAll(() => {
                getEntitiesSpy = jest
                    .spyOn(applicationFlatService, "getEntitiesByIdentifier")
                    .mockResolvedValue(APPLICATIONS);
            });
            afterAll(() => {
                getEntitiesSpy.mockRestore();
            });

            it("gets entities", async () => {
                await applicationFlatService.getRawGrants(IDENTIFIER);
                expect(getEntitiesSpy).toHaveBeenCalledWith(IDENTIFIER);
            });

            it("converts found methods", async () => {
                const actual = await applicationFlatService.getRawGrants(IDENTIFIER);
                expect(actual).toMatchSnapshot();
            });
        });
    });
});
