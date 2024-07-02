import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import { DemarchesSimplifieesEntityAdapter } from "./DemarchesSimplifieesEntityAdapter";
import {
    DATA_ENTITIES,
    SCHEMAS,
} from "../../../../../tests/dataProviders/db/__fixtures__/demarchesSimplifiees.fixtures";
import demarchesSimplifieesService from "../demarchesSimplifiees.service";
jest.mock("../demarchesSimplifiees.service");

describe("DemarchesSimplifieesEntityAdapter", () => {
    // @ts-expect-error
    const mapMock = jest.spyOn(DemarchesSimplifieesEntityAdapter, "mapSchema");
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

        afterEach(() => {
            mockToSubvention.mockClear();
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
        const ENTITY = {};
        const MAPPER = {};

        it("adapts to proper format", () => {
            mapMock.mockReturnValueOnce({
                dateTransmitted: new Date("2022-01-07"),
                providerStatus: "toBeRemovedFromNow",
            });
            // @ts-expect-error mock
            const actual = DemarchesSimplifieesEntityAdapter.toCommon(ENTITY, MAPPER);
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "exercice": 2022,
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
    });

    describe("mapSchema", () => {
        const ENTITY = { before: "a", siret: "SIRET" };
        const MAPPER = {
            key: [
                { to: "after.nested", from: "before" },
                { to: "after.same", value: "toujoursPareil" },
            ],
        };
        const KEY = "key";

        it("adapts to proper format", () => {
            // @ts-expect-error mock
            const actual = DemarchesSimplifieesEntityAdapter.mapSchema(ENTITY, MAPPER, KEY);
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "after": Object {
                    "nested": "a",
                    "same": "toujoursPareil",
                  },
                  "siret": "SIRET",
                }
            `);
        });
    });
});
