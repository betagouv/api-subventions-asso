import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import { DemarchesSimplifieesEntityAdapter } from "./DemarchesSimplifieesEntityAdapter";

describe("DemarchesSimplifieesEntityAdapter", () => {
    describe("toSubvention", () => {
        const SIRET = "00000000000000";

        it("should return subvention with siret", () => {
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(
                {
                    siret: SIRET,
                    demande: { dateDerniereModification: new Date() }
                } as unknown as DemarchesSimplifieesDataEntity,
                {
                    demarcheId: 12345,
                    schema: []
                }
            );

            expect(actual.siret.value).toBe(SIRET);
        });

        it("should return use schema for build subvention", () => {
            const actual = DemarchesSimplifieesEntityAdapter.toSubvention(
                {
                    siret: SIRET,
                    demande: { dateDerniereModification: new Date() },
                    toto: ["jedusor"]
                } as unknown as DemarchesSimplifieesDataEntity,
                {
                    demarcheId: 12345,
                    schema: [
                        {
                            from: "toto[0]",
                            to: "tom"
                        }
                    ]
                }
            );

            expect(actual).toEqual(
                expect.objectContaining({
                    tom: expect.objectContaining({
                        value: "jedusor"
                    })
                })
            );
        });
    });
});
