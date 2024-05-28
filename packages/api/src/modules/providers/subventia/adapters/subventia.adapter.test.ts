import SubventiaAdapter from "./subventia.adapter";
import * as ParseHelper from "../../../../shared/helpers/ParserHelper";

describe(SubventiaAdapter, () => {
    const application = { "Montant Ttc": 600, "Référence administrative - Demande": "ref1" };

    const entity = {
        reference_demande: "ref1",
        service_instructeur: "CIPDR",
        annee_demande: 2023,
        siret: "123456789",
        date_commision: "12/07/2023",
        montants_accorde: 100,
        montants_demande: 600,
        dispositif: "FIPDR",
        sous_dispositif: "",
        status: "Refused",
        provider: "subventia",
    };

    describe("applicationToEntity", () => {
        it("should call indexDataByPathObject", () => {
            let mockIndexDataByPathObject = jest.spyOn(ParseHelper, "indexDataByPathObject").mockReturnValue(entity);

            SubventiaAdapter.applicationToEntity(application);
            expect(mockIndexDataByPathObject).toHaveBeenCalled();
        });

        it("should return entity", () => {
            const expected = entity;
            const actual = SubventiaAdapter.applicationToEntity(application);
            expect(actual).toEqual(expected);
        });
    });
});
