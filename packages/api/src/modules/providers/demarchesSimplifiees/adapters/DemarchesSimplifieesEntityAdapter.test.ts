import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import { DemarchesSimplifieesEntityAdapter } from "./DemarchesSimplifieesEntityAdapter";
import {
    DATA_ENTITIES,
    SCHEMAS,
} from "../../../../../tests/dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import demarchesSimplifieesService from "../demarchesSimplifiees.service";
import DemarchesSimplifieesSchema from "../entities/DemarchesSimplifieesSchema";
import * as providerAdapter from "../../providers.adapter";

const mockAdaptStatus = jest.fn();

jest.mock("../demarchesSimplifiees.service");
jest.mock("../../providers.adapter", () => ({
    toStatusFactory: jest.fn(_conversionArray => mockAdaptStatus),
}));

describe("DemarchesSimplifieesEntityAdapter", () => {
    // @ts-expect-error: mock private method
    const mapMock: jest.SpyInstance = jest.spyOn(DemarchesSimplifieesEntityAdapter, "mapSchema");
    const SIRET = "00000000000000";
    const DEMANDE = {
        siret: SIRET,
        demande: { dateDerniereModification: new Date() },
        toto: ["jedusor"],
    } as unknown as DemarchesSimplifieesDataEntity;
    const MAPPING = {
        demarcheId: 12345,
        schema: [
            {
                from: "toto[0]",
                to: "tom",
            },
        ],
    };

    describe("rawToApplication", () => {
        // @ts-expect-error: parameter type
        const RAW_APPLICATION: RawApplication = { data: { entity: { foo: "bar" }, schema: { boo: "faz" } } };
        // @ts-expect-error: parameter type
        const APPLICATION: DemandeSubvention = { foo: "bar" };
        let mockToSubvention: jest.SpyInstance;

        beforeAll(() => {
            mockToSubvention = jest.spyOn(DemarchesSimplifieesEntityAdapter, "toSubvention");
            mockToSubvention.mockReturnValue(APPLICATION);
        });

        afterAll(() => {
            mockToSubvention.mockRestore();
        });

        it("should call toSubvention", () => {
            DemarchesSimplifieesEntityAdapter.rawToApplication(RAW_APPLICATION);
            const { entity, schema } = RAW_APPLICATION.data;
            expect(mockToSubvention).toHaveBeenCalledWith(entity, schema);
        });

        it("should return DemandeSubvention", () => {
            const expected = APPLICATION;
            const actual = DemarchesSimplifieesEntityAdapter.rawToApplication(RAW_APPLICATION);
            expect(actual).toEqual(expected);
        });
    });

    describe("toSubvention", () => {
        it("should return subvention with siret", () => {
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(DEMANDE, MAPPING);

            expect(actual.siret.value).toBe(SIRET);
        });

        it("sets siret from mapping if given", () => {
            const OTHER_SIRET = "09876543210987";
            mapMock.mockReturnValueOnce({ siret: OTHER_SIRET });
            const expected = OTHER_SIRET;
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(DEMANDE, MAPPING).siret.value;

            expect(actual).toBe(expected);
        });

        it("should use schema to build subvention", () => {
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(DEMANDE, MAPPING);

            expect(actual).toEqual(
                expect.objectContaining({
                    tom: expect.objectContaining({
                        value: "jedusor",
                    }),
                }),
            );
        });

        it("sets annee_demande thanks to date_debut", () => {
            mapMock.mockReturnValueOnce({ date_debut: new Date(2023, 10, 20) });
            const expected = 2023;
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(DEMANDE, MAPPING).annee_demande?.value;

            expect(actual).toBe(expected);
        });

        it("sets annee_demande prioritary to date_debut", () => {
            mapMock.mockReturnValueOnce({ date_debut: new Date(2023, 10, 20), annee_demande: 2024 });
            const expected = 2024;
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(DEMANDE, MAPPING).annee_demande?.value;

            expect(actual).toBe(expected);
        });

        it("calls nestedToProviderValues", () => {
            // @ts-expect-error -- private spy
            const nestSpy = jest.spyOn(DemarchesSimplifieesEntityAdapter, "nestedToProviderValues");
            DemarchesSimplifieesEntityAdapter.toSubvention(DEMANDE, MAPPING);
            expect(nestSpy).toHaveBeenCalled();
        });
    });

    describe("toRawGrant", () => {
        it("should try to get joinKey", () => {
            DemarchesSimplifieesEntityAdapter.toRawGrant(DATA_ENTITIES[0], SCHEMAS[0]);
            expect(demarchesSimplifieesService.getJoinKey).toHaveBeenCalledWith({
                entity: DATA_ENTITIES[0],
                schema: SCHEMAS[0],
            });
        });

        it("should not define joinKey if not found", () => {
            jest.mocked(demarchesSimplifieesService.getJoinKey).mockReturnValueOnce(undefined);
            const expected = undefined;
            const actual = DemarchesSimplifieesEntityAdapter.toRawGrant(DATA_ENTITIES[0], SCHEMAS[0]).joinKey;
            expect(actual).toEqual(expected);
        });

        it("should return RawGrant", () => {
            const EJ = "EJ";
            jest.mocked(demarchesSimplifieesService.getJoinKey).mockReturnValueOnce(EJ);
            const expected = {
                provider: demarchesSimplifieesService.provider.id,
                type: "application",
                data: { entity: DATA_ENTITIES[0], schema: SCHEMAS[0] },
                joinKey: EJ,
            };
            const actual = DemarchesSimplifieesEntityAdapter.toRawGrant(DATA_ENTITIES[0], SCHEMAS[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("toCommon", () => {
        const ENTITY = { siret: "12345678901234" };
        const SCHEMA = {};

        it("adapts to proper format", () => {
            mapMock.mockReturnValueOnce({
                dateTransmitted: new Date("2022-01-07"),
                providerStatus: "sans_suite",
            });
            // @ts-expect-error mock
            const actual = DemarchesSimplifieesEntityAdapter.toCommon(ENTITY, SCHEMA);
            expect(actual).toMatchInlineSnapshot(`
                {
                  "exercice": 2022,
                  "siret": "12345678901234",
                  "statut": "Inéligible",
                }
            `);
        });

        it("sets exercice thanks to dateTransmitted", () => {
            mapMock.mockReturnValueOnce({ dateTransmitted: new Date(2023, 10, 20) });
            const expected = 2023;
            const actual = DemarchesSimplifieesEntityAdapter.toCommon(DEMANDE, MAPPING).exercice;

            expect(actual).toBe(expected);
        });

        it("sets exercice prioritary to dateTransmitted", () => {
            mapMock.mockReturnValueOnce({ dateTransmitted: new Date(2023, 10, 20), exercice: 2024 });
            const expected = 2024;
            const actual = DemarchesSimplifieesEntityAdapter.toCommon(DEMANDE, MAPPING).exercice;

            expect(actual).toBe(expected);
        });

        it("sets siret from mapping if given", () => {
            const OTHER_SIRET = "09876543210987";
            mapMock.mockReturnValueOnce({ siret: OTHER_SIRET });
            const expected = OTHER_SIRET;
            const actual = DemarchesSimplifieesEntityAdapter.toCommon(DEMANDE, MAPPING).siret;

            expect(actual).toBe(expected);
        });

        it("sets siret from entity if nothing from mapping", () => {
            const expected = DEMANDE.siret;
            mapMock.mockReturnValueOnce({});
            const actual = DemarchesSimplifieesEntityAdapter.toCommon(DEMANDE, MAPPING).siret;

            expect(actual).toBe(expected);
        });
    });

    describe("mapSchema", () => {
        const ENTITY = { before: "a", siret: "SIRET" };
        const SCHEMA = {
            key: [
                { to: "after.nested", from: "before" },
                { to: "after.same", value: "toujoursPareil" },
            ],
        };
        const KEY = "key";

        it("adapts to proper format", () => {
            // @ts-expect-error mock
            const actual = DemarchesSimplifieesEntityAdapter.mapSchema(ENTITY, SCHEMA, KEY);
            expect(actual).toMatchInlineSnapshot(`
                {
                  "after": {
                    "nested": "a",
                    "same": "toujoursPareil",
                  },
                }
            `);
        });
    });

    describe("nestedToProviderValues", () => {
        const TO_PV = jest.fn();

        it("in an array call for each element", () => {
            const ARRAY = [0, 0, 0, 0];
            const expected = [1, 2, 3, 4];
            expected.forEach(v => TO_PV.mockReturnValueOnce(v));
            // @ts-expect-error -- test private method
            const actual = DemarchesSimplifieesEntityAdapter.nestedToProviderValues(ARRAY, TO_PV);
            expect(actual).toEqual(expected);
        });

        it("if neither object nor array return computed providerValue", () => {
            const VALUE = "toto";
            const expected = 1;
            TO_PV.mockReturnValueOnce(expected);
            // @ts-expect-error -- test private method
            const actual = DemarchesSimplifieesEntityAdapter.nestedToProviderValues(VALUE, TO_PV);
            expect(actual).toEqual(expected);
        });

        it("if object, call for each attribute", () => {
            const OBJECT = { a: 23, b: 34 };
            const expected = { a: 1, b: 2 };
            Object.values(expected).forEach(v => TO_PV.mockReturnValueOnce(v));
            // @ts-expect-error -- test private method
            const actual = DemarchesSimplifieesEntityAdapter.nestedToProviderValues(OBJECT, TO_PV);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFlat", () => {
        const SCHEMA = "SCHEMA" as unknown as DemarchesSimplifieesSchema;
        const ADAPTED = {
            beneficiaryEstablishmentId: 12345678901234,
            provider: "producerSlug",
            applicationProviderId: "blablablaHash",
            budgetaryYear: 2024,
            ej: "567",
            depositDate: "2024-09-09",
            status: "statut à adapter",
        };

        beforeAll(() => {
            mapMock.mockReturnValue(ADAPTED);
            mockAdaptStatus.mockReturnValue("statutAdapté");
        });

        afterAll(() => {
            mapMock.mockRestore();
            mockAdaptStatus.mockRestore();
        });

        it("maps schema", () => {
            DemarchesSimplifieesEntityAdapter.toFlat(DEMANDE, SCHEMA);
            expect(mapMock).toHaveBeenCalledWith(DEMANDE, SCHEMA, "flatSchema");
        });

        it("adapts status", () => {
            const expected = ADAPTED.status;
            DemarchesSimplifieesEntityAdapter.toFlat(DEMANDE, SCHEMA);
            // @ts-expect-error -- private attribute
            expect(providerAdapter.toStatusFactory).toHaveBeenCalledWith(
                DemarchesSimplifieesEntityAdapter._statusConversionArray,
            );
            expect(mockAdaptStatus).toHaveBeenCalledWith(expected);
        });

        it("adapts built attributes", () => {
            const ENTITY = { demarcheId: 987 } as DemarchesSimplifieesDataEntity;
            const actual = DemarchesSimplifieesEntityAdapter.toFlat(ENTITY, SCHEMA);
            expect(actual).toMatchSnapshot();
        });
    });
});
