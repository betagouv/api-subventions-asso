import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import { DemarchesSimplifieesEntityAdapter } from "./DemarchesSimplifieesEntityAdapter";

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
