import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import { DemarchesSimplifieesEntityAdapter } from "./DemarchesSimplifieesEntityAdapter";

describe("DemarchesSimplifieesEntityAdapter", () => {
    describe("toSubvention", () => {
        const SIRET = "00000000000000";

        it("should return subvention with siret", () => {
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(
                {
                    siret: SIRET,
                    demande: { dateDerniereModification: new Date() },
                } as unknown as DemarchesSimplifieesDataEntity,
                {
                    demarcheId: 12345,
                    schema: [],
                },
            );

            expect(actual.siret.value).toBe(SIRET);
        });

        it("should use schema to build subvention", () => {
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(
                {
                    siret: SIRET,
                    demande: { dateDerniereModification: new Date() },
                    toto: ["jedusor"],
                } as unknown as DemarchesSimplifieesDataEntity,
                {
                    demarcheId: 12345,
                    schema: [
                        {
                            from: "toto[0]",
                            to: "tom",
                        },
                    ],
                },
            );

            expect(actual).toEqual(
                expect.objectContaining({
                    tom: expect.objectContaining({
                        value: "jedusor",
                    }),
                }),
            );
        });
    });

    describe("toCommon", () => {
        let privateMappingSpy;
        const ENTITY = {};
        const MAPPER = {};

        // @ts-expect-error mock private
        beforeAll(() => (privateMappingSpy = jest.spyOn(DemarchesSimplifieesEntityAdapter, "mapSchema")));
        afterAll(() => privateMappingSpy.mockRestore());

        it("adapts to proper format", () => {
            privateMappingSpy.mockReturnValueOnce({
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
    });

    describe("mapSchema", () => {
        const ENTITY = { before: "a", siret: "SIRET" };
        const MAPPER = { key: [{ to: "after.nested", from: "before" }] };
        const KEY = "key";

        it("adapts to proper format", () => {
            // @ts-expect-error mock
            const actual = DemarchesSimplifieesEntityAdapter.mapSchema(ENTITY, MAPPER, KEY);
            expect(actual).toMatchInlineSnapshot(`
                Object {
                  "after": Object {
                    "nested": "a",
                  },
                  "siret": "SIRET",
                }
            `);
        });
    });
});
