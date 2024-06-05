import SubventiaAdapter from "./subventia.adapter";
import * as ParseHelper from "../../../../shared/helpers/ParserHelper";
import SubventiaDto from "../@types/subventia.dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { ApplicationStatus, ProviderValue } from "dto";
import _ from "lodash";
import { ObjectId } from "mongodb";

describe(SubventiaAdapter, () => {
    const application = { "Montant Ttc": 600, "Référence administrative - Demande": "ref1" } as SubventiaDto;

    const entityIncomplete = {
        reference_demande: "ref1",
        service_instructeur: "CIPDR",
        annee_demande: 2023,
        siret: "123456789",
        date_commision: new Date("2023-04-01T00:00:00.000Z"),
        montants_accorde: 100,
        montants_demande: 600,
        dispositif: "FIPDR",
        sous_dispositif: "",
        status: "Refused",
        statut_label: ApplicationStatus.REFUSED,
    };

    const exportDate = new Date("2022-08-02T00:00:00.000Z");
    const entity = { ...entityIncomplete, provider: "subventia", exportDate: exportDate };

    const dbo = { ...entity, __data__: [], _id: new ObjectId("123456789") };

    describe("applicationToEntity", () => {
        it("should call indexDataByPathObject", () => {
            let mockIndexDataByPathObject = jest
                .spyOn(ParseHelper, "indexDataByPathObject")
                .mockReturnValue(entityIncomplete);

            SubventiaAdapter.applicationToEntity(application, exportDate);
            expect(mockIndexDataByPathObject).toHaveBeenCalled();
        });

        it("should return entity", () => {
            const expected = entity;
            const actual = SubventiaAdapter.applicationToEntity(application, exportDate);
            expect(actual).toEqual(expected);
        });
    });

    describe("toDemandeSubventionDto", () => {
        let mockToPV = jest.fn().mockImplementation(value => value);
        let mockBuildProviderValueAdapter = jest
            .spyOn(ProviderValueFactory, "buildProviderValueAdapter")
            .mockReturnValue(mockToPV);

        it("should call ProviderValueFactory.buildProviderValueAdapter once", () => {
            SubventiaAdapter.toDemandeSubventionDto(dbo);
            expect(mockBuildProviderValueAdapter).toHaveBeenCalledWith("Subventia", exportDate);
        });

        it("should call toPV with ten different attributs", () => {
            const attributes = [
                "siret",
                "service_instructeur",
                "status",
                "statut_label",
                "montants_accorde",
                "montants_demande",
                "date_commision",
                "annee_demande",
                "dispositif",
                "sous_dispositif",
            ];

            SubventiaAdapter.toDemandeSubventionDto(dbo);
            attributes.forEach(attr => {
                expect(mockToPV).toHaveBeenCalledWith(dbo[attr]);
            });
        });

        it("should return DemandeSubvention", () => {
            mockBuildProviderValueAdapter.mockRestore();
            mockToPV.mockRestore();
            const actual = SubventiaAdapter.toDemandeSubventionDto(dbo);
            expect(actual).toMatchSnapshot();
        });
    });

    describe("toCommon", () => {
        it("should return ApplicationDto", () => {
            const expected = {
                dispositif: "FIPDR",
                exercice: 2023,
                montant_accorde: 100,
                montant_demande: 600,
                objet: "",
                service_instructeur: "CIPDR",
                siret: "123456789",
                statut: ApplicationStatus.REFUSED,
            };
            const actual = SubventiaAdapter.toCommon(dbo);
            expect(actual).toEqual(expected);
        });
    });
});
