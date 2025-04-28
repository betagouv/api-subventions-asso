import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY,
} from "../../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import {
    DATA_BRETAGNE_RECORDS,
    MINISTRY_ENTITIES,
    PROGRAM_ENTITIES,
} from "../../dataBretagne/__fixtures__/dataBretagne.fixture";
import {
    DISPOSITIF_DTOS,
    POSTE_DTO_WITH_DATE,
    TIER_DTOS,
    TYPE_POSTE_DTOS,
    VERSEMENT_DTO_WITH_DATE,
} from "../__fixtures__/fonjepDtos";
import { POSTE_ENTITY, TIERS_ENTITY, VERSEMENT_ENTITY } from "../__fixtures__/fonjepEntities";

import FonjepEntityAdapter from "./FonjepEntityAdapter";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
jest.mock("../../dataBretagne/dataBretagne.service");

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

    describe("getBopFromFounderCode", () => {
        it.each`
            code         | expected
            ${"10012"}   | ${361}
            ${undefined} | ${undefined}
        `("should return value", ({ code, expected }) => {
            const actual = FonjepEntityAdapter.getBopFromFounderCode(code);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepPaymentFlat", () => {
        const PAYMENT_ID = "PAYMENT_ID";
        const UNIQUE_ID = "UNIQUE_ID";
        const PROGRAM_CODE = "163";
        // @ts-expect-error: mock private method
        const mockBuildPaymentFlatPaymentId: jest.SpyInstance = jest.spyOn(
            FonjepEntityAdapter,
            "buildPaymentFlatPaymentId",
        );
        // @ts-expect-error: mock private method
        const mockBuildPaymentFlatUniqueId: jest.SpyInstance = jest.spyOn(
            FonjepEntityAdapter,
            "buildPaymentFlatUniqueId",
        );
        const mockGetBopFromFounderCode = jest.spyOn(FonjepEntityAdapter, "getBopFromFounderCode");

        beforeAll(() => {
            mockBuildPaymentFlatPaymentId.mockReturnValue(PAYMENT_ID);
            mockBuildPaymentFlatUniqueId.mockReturnValue(UNIQUE_ID);
            mockGetBopFromFounderCode.mockReturnValue(163);
            jest.mocked(dataBretagneService.getMinistryEntity).mockReturnValue(MINISTRY_ENTITIES[0]);
        });

        afterAll(() => {
            [mockBuildPaymentFlatPaymentId, mockBuildPaymentFlatUniqueId, mockGetBopFromFounderCode].forEach(mock =>
                mock.mockRestore(),
            );
            jest.mocked(dataBretagneService.getMinistryEntity).mockReset();
        });

        it("should throw error if no siretOuRidet field", () => {
            expect(() =>
                FonjepEntityAdapter.toFonjepPaymentFlat(
                    {
                        payment: VERSEMENT_ENTITY,
                        position: POSTE_ENTITY,
                        thirdParty: { ...TIERS_ENTITY, siretOuRidet: null },
                    },
                    DATA_BRETAGNE_RECORDS,
                ),
            ).toThrowError("Trying to create a FONJEP PaymentFlat without siret or ridet information");
        });

        it("should build unique ID", () => {
            FonjepEntityAdapter.toFonjepPaymentFlat(
                { payment: VERSEMENT_ENTITY, position: POSTE_ENTITY, thirdParty: TIERS_ENTITY },
                DATA_BRETAGNE_RECORDS,
            );
            expect(mockBuildPaymentFlatUniqueId).toHaveBeenCalledWith({
                paymentId: PAYMENT_ID,
                payment: VERSEMENT_ENTITY,
                program: DATA_BRETAGNE_RECORDS.programs[PROGRAM_CODE],
            });
        });

        it("should build payment ID", () => {
            FonjepEntityAdapter.toFonjepPaymentFlat(
                { payment: VERSEMENT_ENTITY, position: POSTE_ENTITY, thirdParty: TIERS_ENTITY },
                DATA_BRETAGNE_RECORDS,
            );
            expect(mockBuildPaymentFlatPaymentId).toHaveBeenCalledWith({
                thirdParty: TIERS_ENTITY,
                position: POSTE_ENTITY,
                payment: VERSEMENT_ENTITY,
            });
        });

        it("returns FonjepPaymentFlat entity", () => {
            const actual = FonjepEntityAdapter.toFonjepPaymentFlat(
                { payment: VERSEMENT_ENTITY, position: POSTE_ENTITY, thirdParty: TIERS_ENTITY },
                DATA_BRETAGNE_RECORDS,
            );
            expect(actual).toMatchSnapshot();
        });
    });

    describe("extractPositionCode", () => {
        it("returns code poste", () => {
            const expected = "CODE_POSTE"; // cf FONJEP_PAYMENT_FLAT fixture
            const actual = FonjepEntityAdapter.extractPositionCode(FONJEP_PAYMENT_FLAT_ENTITY);
            expect(actual).toEqual(expected);
        });

        it("throws error if not a FonjepPaymentFlatEntity", () => {
            // @ts-expect-error: edge case with wrong parameter type
            expect(() => FonjepEntityAdapter.extractPositionCode(CHORUS_PAYMENT_FLAT_ENTITY)).toThrowError(
                "You must extract a position code from a FonjepPaymentFlat entity",
            );
        });
    });

    describe("buildPaymentFlatPaymentId", () => {
        it("return idVersement", () => {
            // @ts-expect-error: test private method
            const actual = FonjepEntityAdapter.buildPaymentFlatPaymentId({
                thirdParty: TIERS_ENTITY,
                position: POSTE_ENTITY,
                payment: VERSEMENT_ENTITY,
            });
            expect(actual).toMatchSnapshot();
        });
    });
    describe("buildPaymentFlatUniqueId", () => {
        it("return idVersement", () => {
            // @ts-expect-error: test private method
            const actual = FonjepEntityAdapter.buildPaymentFlatUniqueId({
                paymentId: "PAYMENT_ID",
                payment: VERSEMENT_ENTITY,
                program: PROGRAM_ENTITIES[0],
            });
            expect(actual).toMatchSnapshot();
        });
    });
});
