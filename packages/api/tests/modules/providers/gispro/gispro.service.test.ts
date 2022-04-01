import IGisproRequestInformations from '../../../../src/modules/providers/gispro/@types/IGisproRequestInformations'
import GisproRequestEntity from '../../../../src/modules/providers/gispro/entities/GisproRequestEntity'
import gisproService from '../../../../src/modules/providers/gispro/gispro.service'

const validLegalInformations = {
    siret: "12345678901234",
    rna: "FAKE_RNA",
    name: "FAKE_NAME"
}

const ValidGisproRequestInformation = {
    gisproId: "FAKE_GISPRO_ID",
    dispositif: "FAKE_DISPOSITIF",
    sous_dispositif: "FAKE_SS_DISPOSITIF",
    montantsTotal: 12345
}

describe("GisproService", () => {
    describe("validRequest()", () => {
        it("return success if valid", () => {
            const request = new GisproRequestEntity(validLegalInformations, ValidGisproRequestInformation, {}, undefined)
            const actual = gisproService.validRequest(request);
            const expected = { success: true }
            expect(actual).toEqual(expected);
        })
        
        it("return error if SIRET invalid", () => {
            const invalidLegalInformation = Object.assign({ ...validLegalInformations, siret: "FAKE_SIRET"});
            const request = new GisproRequestEntity(invalidLegalInformation, ValidGisproRequestInformation, {}, undefined)
            const actual = gisproService.validRequest(request);
            const expected = { 
                "code": 1,
                "data":  {
                    "name": invalidLegalInformation.name,
                    "rna": invalidLegalInformation.rna,
                    "siret": invalidLegalInformation.siret },
                "message": `INVALID SIRET FOR ${invalidLegalInformation.siret}`,
                "success": false }
            expect(actual).toEqual(expected);
        })
    })

    describe('findBySiret', () => {
        it('should return a request', async () => {
            const entity = new GisproRequestEntity({ siret: "FAKE_SIRET", rna: "RNA", name: "NAME"}, { gisproId: "FAKE_ID_2" } as IGisproRequestInformations, {}, undefined);
            await gisproService.addRequest(entity);
            expect(await gisproService.findBySiret("FAKE_SIRET")).toMatchObject([entity]);
        });
    });
})