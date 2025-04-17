import Siren from "../../valueObjects/Siren";

const mockProvider = { provider: { provider: { name: "prov1" } } };

import applicationFlatPort from "../../dataProviders/db/applicationFlat/applicationFlat.port";
import applicationFlatService from "./applicationFlat.service";
import { ApplicationFlatEntity } from "../../entities/ApplicationFlatEntity";
import ApplicationFlatAdapter from "./ApplicationFlatAdapter";
import { DemandeSubvention } from "dto";
import { RawApplication } from "../grant/@types/rawGrant";

import ApplicationFlatProvider from "./@types/applicationFlatProvider";
import Siret from "../../valueObjects/Siret";
import AssociationIdentifier from "../../valueObjects/AssociationIdentifier";
import EstablishmentIdentifier from "../../valueObjects/EstablishmentIdentifier";

jest.mock("../providers", () => ({
    applicationFlatProviders: [mockProvider],
}));
jest.mock("../../dataProviders/db/applicationFlat/applicationFlat.port");
jest.mock("./ApplicationFlatAdapter");
jest.mock("../../valueObjects/Siret");

describe("ApplicationFlatService", () => {
    const FLAT_ENTITY = {} as ApplicationFlatEntity;
    describe("application part", () => {
        const [E1, E2] = ["entity1", "entity2"] as unknown as ApplicationFlatEntity[];
        describe.each`
            identifierType | rawIdentifier                  | findMethod                         | identifierConstructor
            ${"siret"}     | ${new Siret("12345678901234")} | ${applicationFlatPort.findBySiret} | ${EstablishmentIdentifier.fromSiret}
            ${"siren"}     | ${new Siren("123456789")}      | ${applicationFlatPort.findBySiren} | ${AssociationIdentifier.fromSiren}
        `("getEntitiesByIdentifier", ({ rawIdentifier, identifierConstructor, findMethod }) => {
            beforeAll(() => {
                findMethod.mockResolvedValue([E1, E2]);
            });
            afterAll(() => {
                findMethod.mockRestore();
            });

            it("if identifier is $identifierType, call proper port method", async () => {
                await applicationFlatService.getEntitiesByIdentifier(identifierConstructor(rawIdentifier));
                expect(findMethod).toHaveBeenCalledWith(rawIdentifier);
            });

            it("returns entities", async () => {
                const expected = [E1, E2];
                const actual = await applicationFlatService.getEntitiesByIdentifier(
                    identifierConstructor(rawIdentifier),
                );
                expect(actual).toEqual(expected);
            });
        });

        describe("rawToApplication", () => {
            const RAW_GRANT = {
                type: "application",
                provider: "some",
                data: FLAT_ENTITY,
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

        describe("getDemandeSubvention", () => {
            let getEntitiesSpy;
            const [E1, E2] = ["entity1", "entity2"] as unknown as ApplicationFlatEntity[];
            const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren("987654321"));

            beforeAll(() => {
                getEntitiesSpy = jest
                    .spyOn(applicationFlatService, "getEntitiesByIdentifier")
                    .mockResolvedValue([E1, E2]);
            });
            afterAll(() => {
                getEntitiesSpy.mockRestore();
            });

            it("gets entities", async () => {
                await applicationFlatService.getDemandeSubvention(IDENTIFIER);
                expect(getEntitiesSpy).toHaveBeenCalledWith(IDENTIFIER);
            });

            it("adapts all applications", async () => {
                await applicationFlatService.getDemandeSubvention(IDENTIFIER);
                expect(ApplicationFlatAdapter.toDemandeSubvention).toHaveBeenCalledWith(E1);
                expect(ApplicationFlatAdapter.toDemandeSubvention).toHaveBeenCalledWith(E2);
            });

            it("returns non-null adapted applications", async () => {
                const A2 = "adapted 2" as unknown as DemandeSubvention;
                jest.mocked(ApplicationFlatAdapter.toDemandeSubvention).mockReturnValueOnce(null);
                jest.mocked(ApplicationFlatAdapter.toDemandeSubvention).mockReturnValue(A2);
                const expected = [A2];
                const actual = await applicationFlatService.getDemandeSubvention(IDENTIFIER);
                expect(actual).toEqual(expected);
            });
        });
    });

    describe("grant part", () => {
        describe("getRawGrants", () => {
            let getEntitiesSpy;
            const [E1, E2] = [
                { provider: "fonjep", idVersement: "poste1" },
                { provider: "autre", ej: "ej2" },
            ] as unknown as ApplicationFlatEntity[];
            const IDENTIFIER = AssociationIdentifier.fromSiren(new Siren("987654321"));

            beforeAll(() => {
                getEntitiesSpy = jest
                    .spyOn(applicationFlatService, "getEntitiesByIdentifier")
                    .mockResolvedValue([E1, E2]);
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
                expect(actual).toMatchInlineSnapshot(`
                    Array [
                      Object {
                        "data": Object {
                          "idVersement": "poste1",
                          "provider": "fonjep",
                        },
                        "joinKey": "poste1",
                        "provider": "fonjep",
                        "type": "application",
                      },
                      Object {
                        "data": Object {
                          "ej": "ej2",
                          "provider": "autre",
                        },
                        "joinKey": "ej2",
                        "provider": "autre",
                        "type": "application",
                      },
                    ]
                `);
            });
        });
    });

    describe("applicationFlat part", () => {
        describe("updateApplicationsFlatCollection", () => {
            it("updates for all providers with given exercise", async () => {
                const updateByProviderSpy = jest.spyOn(
                    applicationFlatService,
                    // @ts-expect-error -- private method
                    "updateApplicationsFlatCollectionByProvider",
                );
                const EXERCICE = 2042;
                await applicationFlatService.updateApplicationsFlatCollection(EXERCICE);
                expect(updateByProviderSpy).toHaveBeenCalledWith(mockProvider, EXERCICE, EXERCICE);
            });

            it("updates for all providers and years from 2017 to now + 2 years", async () => {
                jest.useFakeTimers();
                jest.setSystemTime(new Date("2020-03-22"));
                const updateByProviderSpy = jest.spyOn(
                    applicationFlatService,
                    // @ts-expect-error -- private method
                    "updateApplicationsFlatCollectionByProvider",
                );
                await applicationFlatService.updateApplicationsFlatCollection();
                expect(updateByProviderSpy).toHaveBeenCalledWith(mockProvider, 2017, 2022);
                jest.useRealTimers();
            });
        });

        describe("updateApplicationsFlatCollectionByProvider", () => {
            const buildStream = () =>
                new ReadableStream({
                    start(controller) {
                        for (const _i in Array(2001).fill(0)) {
                            controller.enqueue(ENTITY);
                        }
                        controller.close();
                    },
                });
            const ENTITY = {};
            const PROVIDER = {
                isApplicationFlatProvider: true,
                getApplicationFlatStream: jest.fn((_start, _end) => buildStream()),
            } as unknown as ApplicationFlatProvider;
            const START = 2020;
            const END = 2022;

            it("gets stream from provider", async () => {
                // @ts-expect-error -- private method
                await applicationFlatService.updateApplicationsFlatCollectionByProvider(PROVIDER, START, END);
                expect(PROVIDER.getApplicationFlatStream).toHaveBeenCalledWith(START, END);
            });

            it("calls port's upsert as many times as necessary according to chunk size", async () => {
                // @ts-expect-error -- private method
                await applicationFlatService.updateApplicationsFlatCollectionByProvider(PROVIDER, START, END);
                expect(applicationFlatPort.upsertMany).toHaveBeenCalledTimes(3);
            });
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
});
