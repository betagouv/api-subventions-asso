import IGisproActionInformations from "../../../../src/modules/providers/gispro/@types/IGisproActionInformations";
import GisproActionEntity from "../../../../src/modules/providers/gispro/entities/GisproActionEntity";
import gisproService from "../../../../src/modules/providers/gispro/gispro.service";

const ValidGisproRequestInformation: IGisproActionInformations = {
    siret: "12345678901234",
    montant: 12345,
    codeTier: "FAKE_CODE_TIER",
    tier: "FAKE_TIER",
    typeTier: "FAKE_TYPE_TIER",
    codeRequest: "FAKE_CODE_REQUEST",
    action: "ACTION",
    codeAction: "FAKE_CODE_ACTION",
    direction: "FAKE_CODE_DIRECTION",
    pnOrOs: "FAKE_CODE_PNOS",
    importedDate: new Date()
};

describe("GisproService", () => {
    describe("validEntity()", () => {
        it("return success if valid", () => {
            const request = new GisproActionEntity(ValidGisproRequestInformation, {});
            const actual = gisproService.validEntity(request);
            const expected = true;
            expect(actual).toEqual(expected);
        });

        it("return error if SIRET invalid", () => {
            const invalidGisproRequestInformation = Object.assign({
                ...ValidGisproRequestInformation,
                siret: "FAKE_SIRET"
            });
            const request = new GisproActionEntity(invalidGisproRequestInformation, {});
            const actual = gisproService.validEntity(request);
            const expected = {
                code: 1,
                data: { ...invalidGisproRequestInformation },
                message: `INVALID SIRET FOR ${invalidGisproRequestInformation.siret}`
            };
            expect(actual).toEqual(expected);
        });
    });

    describe("findBySiret", () => {
        it("should return a request", async () => {
            const entity = new GisproActionEntity(ValidGisproRequestInformation as IGisproActionInformations, {});
            await gisproService.add(entity);
            expect(await gisproService.findBySiret("12345678901234")).toMatchObject([entity]);
        });
    });
});
