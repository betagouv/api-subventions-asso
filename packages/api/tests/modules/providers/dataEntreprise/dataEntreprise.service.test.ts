import axios from "axios";
import dataEntrepriseService from "../../../../src/modules/providers/dataEntreprise/dataEntreprise.service";
import ProviderValueAdapter from "../../../../src/shared/adapters/ProviderValueAdapter";

describe("dateEntrepise.service", () => {
    const now = new Date();
    const toPVs = (value: unknown, provider = "TEST") => ProviderValueAdapter.toProviderValues(value, provider, now);
    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        dataEntrepriseService.requestCache.destroy();
    })

    describe("findAssociationByRna", () => {
        it("should be called api", async () => {
            const fakeData = { association: {id_association: "FAKE_DATA", updated_at: now}}
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await dataEntrepriseService.findAssociationByRna("RNA_FAKE", true);

            expect(mock).toHaveBeenCalled();
            expect(result).toMatchObject({
                rna: toPVs("FAKE_DATA", "<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>")
            })
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await dataEntrepriseService.findAssociationByRna("RNA_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });

    describe("findEtablissementBySiret", () => {
        it("should be called api", async () => {
            const fakeData = { etablissement: {siret: "FAKE_DATA", unite_legale: {}, updated_at: now }}
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await dataEntrepriseService.findEtablissementBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toMatchObject({
                siret: toPVs("FAKE_DATA", "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>")
            })
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await dataEntrepriseService.findEtablissementBySiret("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });

    describe("findAssociationBySiren", () => {
        it("should be called api", async () => {
            const fakeData = { unite_legale: { updated_at: now, siren: "SIREN_FAKE", etablissement_siege: {}, etablissements: [] }}

            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => (Promise.resolve({data: fakeData})));

            const result = await dataEntrepriseService.findAssociationBySiren("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toMatchObject(
                {
                    siren: toPVs("SIREN_FAKE", "<Base SIRET> EntrepriseData <https://entreprise.data.gouv.fr>")
                }
            )
        });

        it("should return null if error", async () => {
            const mock = jest.spyOn(axios, "get").mockImplementationOnce(() => Promise.reject("ERROR"));

            const result = await dataEntrepriseService.findAssociationBySiren("SIRET_FAKE");

            expect(mock).toHaveBeenCalled();
            expect(result).toBe(null)
        });
    });
});