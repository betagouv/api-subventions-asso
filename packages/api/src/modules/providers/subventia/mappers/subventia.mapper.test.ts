import SubventiaMapper from "./subventia.mapper";
import SubventiaDto from "../@types/subventia.dto";
import { ApplicationStatus } from "dto";
import { GenericParser } from "../../../../shared/GenericParser";
import { SUBVENTIA_DBO } from "../__fixtures__/subventia.fixture";

describe(SubventiaMapper, () => {
    const application = { "Montant Ttc": 600, "Référence administrative - Demande": "ref1" } as SubventiaDto;

    const entityIncomplete = {
        reference_demande: "ref1",
        service_instructeur: "CIPDR",
        annee_demande: 2023,
        siret: "123456789",
        date_commission: new Date("2023-04-01T00:00:00.000Z"),
        montants_accorde: 100,
        montants_demande: 600,
        dispositif: "FIPDR",
        sous_dispositif: "",
        status: "Refused",
        statut_label: ApplicationStatus.REFUSED,
    };

    const exportDate = new Date("2022-08-02T00:00:00.000Z");
    const entity = { ...entityIncomplete, provider: "subventia", updateDate: exportDate };

    describe("applicationToEntity", () => {
        it("should call indexDataByPathObject", () => {
            const mockIndexDataByPathObject = jest
                .spyOn(GenericParser, "indexDataByPathObject")
                .mockReturnValue(entityIncomplete);

            SubventiaMapper.applicationToEntity(application, exportDate);
            expect(mockIndexDataByPathObject).toHaveBeenCalledTimes(1);
        });

        it("should return entity", () => {
            const expected = entity;
            const actual = SubventiaMapper.applicationToEntity(application, exportDate);
            expect(actual).toEqual(expected);
        });
    });

    describe("toApplicationFlat", () => {
        it("returns application flat", () => {
            const actual = SubventiaMapper.toApplicationFlat(SUBVENTIA_DBO);
            expect(actual).toMatchSnapshot();
        });
    });
});
