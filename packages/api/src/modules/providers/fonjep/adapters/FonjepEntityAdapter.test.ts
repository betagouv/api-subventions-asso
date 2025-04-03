import {
    DISPOSITIF_DTOS,
    POSTE_DTO_WITH_DATE,
    TIER_DTOS,
    TYPE_POSTE_DTOS,
    VERSEMENT_DTO_WITH_DATE,
} from "../__fixtures__/fonjepDtos";

import FonjepEntityAdapter from "./FonjepEntityAdapter";

describe("FonjepEntityAdapter", () => {
    describe("toFonjepTierEntity()", () => {
        it("should map FonjepTiersDto to FonjepTiersEntity correctly", () => {
            const tier = TIER_DTOS[0];
            const expected = {
                code: tier.Code,
                raisonSociale: tier.RaisonSociale,
                estAssociation: tier.EstAssociation,
                estCoFinanceurPostes: tier.EstCoFinanceurPostes,
                estFinanceurPostes: tier.EstFinanceurPostes,
                siretOuRidet: tier.SiretOuRidet,
                codePostal: tier.CodePostal,
                ville: tier.Ville,
                contactEmail: tier.ContactEmail,
            };

            const actual = FonjepEntityAdapter.toFonjepTierEntity(tier);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepPosteEntity()", () => {
        it("should map FonjepPosteDto to FonjepPosteEntity correctly", () => {
            const poste = POSTE_DTO_WITH_DATE;
            const expected = {
                code: poste.Code,
                annee: poste.Annee,
                associationBeneficiaireCode: poste.AssociationBeneficiaireCode,
                financeurPrincipalCode: poste.FinanceurPrincipalCode,
                financeurAttributeurCode: poste.FinanceurAttributeurCode,
                dateFinTriennalite: poste.DateFinTriennalite,
                dispositifId: poste.DispositifId,
                pstStatutPosteLibelle: poste.PstStatutPosteLibelle,
                pstRaisonStatutLibelle: poste.PstRaisonStatutLibelle,
                associationImplantationCode: poste.AssociationImplantationCode,
                montantSubvention: poste.MontantSubvention,
                pstTypePosteCode: poste.PstTypePosteCode,
                pleinTemps: poste.PleinTemps,
                doublementUniteCompte: poste.DoublementUniteCompte,
            };

            const actual = FonjepEntityAdapter.toFonjepPosteEntity(poste);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepVersementEntity()", () => {
        it("should map FonjepVersementDtoWithExcelDate to FonjepVersementEntity correctly", () => {
            const versement = VERSEMENT_DTO_WITH_DATE;
            const expected = {
                posteCode: versement.PosteCode,
                periodeDebut: versement.PeriodeDebut,
                periodeFin: versement.PeriodeFin,
                dateVersement: versement.DateVersement,
                montantAPayer: versement.MontantAPayer,
                montantPaye: versement.MontantPaye,
            };

            const actual = FonjepEntityAdapter.toFonjepVersementEntity(versement);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepTypePosteEntity()", () => {
        it("should map FonjepTypePosteDto to FonjepTypePosteEntity correctly", () => {
            const typePoste = TYPE_POSTE_DTOS[0];
            const expected = {
                code: typePoste.Code,
                libelle: typePoste.Libelle,
            };
            const actual = FonjepEntityAdapter.toFonjepTypePosteEntity(typePoste);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepDispositifEntity()", () => {
        it("should map FonjepDispositifDto to FonjepDispositifEntity correctly", () => {
            const dispositif = DISPOSITIF_DTOS[0];
            const expected = {
                id: dispositif.ID,
                libelle: dispositif.Libelle,
                financeurCode: dispositif.FinanceurCode,
            };
            const actual = FonjepEntityAdapter.toFonjepDispositifEntity(dispositif);
            expect(actual).toEqual(expected);
        });
    });
});
