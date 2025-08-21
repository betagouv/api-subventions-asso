import {
    CHORUS_PAYMENT_FLAT_ENTITY,
    FONJEP_PAYMENT_FLAT_ENTITY,
} from "../../../paymentFlat/__fixtures__/paymentFlatEntity.fixture";
import { DATA_BRETAGNE_RECORDS, MINISTRY_ENTITIES } from "../../dataBretagne/__fixtures__/dataBretagne.fixture";
import {
    DISPOSITIF_DTOS,
    POSTE_DTO_WITH_DATE,
    TIER_DTOS,
    TYPE_POSTE_DTOS,
    VERSEMENT_DTO_WITH_DATE,
} from "../__fixtures__/fonjepDtos";
import { DISPOSITIF_ENTITY, POSTE_ENTITY, TIERS_ENTITY, VERSEMENT_ENTITY } from "../__fixtures__/fonjepEntities";

import FonjepEntityAdapter from "./FonjepEntityAdapter";
import dataBretagneService from "../../dataBretagne/dataBretagne.service";
import Siret from "../../../../identifierObjects/Siret";
import { GenericAdapter } from "../../../../shared/GenericAdapter";
jest.mock("../../dataBretagne/dataBretagne.service");
import { removeWhitespace } from "../../../../shared/helpers/StringHelper";
jest.mock("../../../../shared/helpers/StringHelper");
import * as DateHelper from "../../../../shared/helpers/DateHelper";
import FonjepPosteEntity from "../entities/FonjepPosteEntity";
import FonjepDispositifEntity from "../entities/FonjepDispositifEntity";
import FonjepTiersEntity from "../entities/FonjepTiersEntity";
import EstablishmentIdentifier from "../../../../identifierObjects/EstablishmentIdentifier";
jest.mock("../../../../identifierObjects/EstablishmentIdentifier");
jest.mock("../../../../shared/helpers/DateHelper");

describe("FonjepEntityAdapter", () => {
    const EXPORT_DATE = new Date("2025-08-11");

    describe("toFonjepTierEntity()", () => {
        beforeAll(() => {
            jest.mocked(removeWhitespace).mockImplementation(str => str);
        });

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
                updateDate: EXPORT_DATE,
            };

            const actual = FonjepEntityAdapter.toFonjepTierEntity(tier, EXPORT_DATE);
            expect(actual).toEqual(expected);
        });

        it("call removeWhitespace if siretOrRidet is defined", () => {
            const tier = TIER_DTOS[0];
            FonjepEntityAdapter.toFonjepTierEntity(tier, EXPORT_DATE);
            expect(removeWhitespace).toHaveBeenCalledWith(tier.SiretOuRidet);
        });

        it("should not call removeWhitespace if siretOrRidet is not defined", () => {
            const tier = { ...TIER_DTOS[0], SiretOuRidet: null };
            FonjepEntityAdapter.toFonjepTierEntity(tier, EXPORT_DATE);
            expect(removeWhitespace).not.toHaveBeenCalled();
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
                updateDate: EXPORT_DATE,
            };

            const actual = FonjepEntityAdapter.toFonjepPosteEntity(poste, EXPORT_DATE);
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
                updateDate: EXPORT_DATE,
            };

            const actual = FonjepEntityAdapter.toFonjepVersementEntity(versement, EXPORT_DATE);
            expect(actual).toEqual(expected);
        });
    });

    describe("toFonjepTypePosteEntity()", () => {
        it("should map FonjepTypePosteDto to FonjepTypePosteEntity correctly", () => {
            const typePoste = TYPE_POSTE_DTOS[0];
            const expected = {
                code: typePoste.Code,
                libelle: typePoste.Libelle,
                updateDate: EXPORT_DATE,
            };
            const actual = FonjepEntityAdapter.toFonjepTypePosteEntity(typePoste, EXPORT_DATE);
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
                updateDate: EXPORT_DATE,
            };
            const actual = FonjepEntityAdapter.toFonjepDispositifEntity(dispositif, EXPORT_DATE);
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

    describe("Flat formats", () => {
        const PAYMENT_ID = "PAYMENT_ID";
        const UNIQUE_ID = "UNIQUE_ID";
        const PROGRAM_CODE = "163";

        describe("toFonjepPaymentFlat", () => {
            const mockBuildFlatPaymentId: jest.SpyInstance = jest.spyOn(
                FonjepEntityAdapter,
                // @ts-expect-error: mock private method
                "buildFlatPaymentId",
            );
            const mockBuildPaymentFlatUniqueId: jest.SpyInstance = jest.spyOn(
                FonjepEntityAdapter,
                // @ts-expect-error: mock private method
                "buildPaymentFlatUniqueId",
            );
            const mockGetBopFromFounderCode = jest.spyOn(FonjepEntityAdapter, "getBopFromFounderCode");

            beforeAll(() => {
                mockBuildFlatPaymentId.mockReturnValue(PAYMENT_ID);
                mockBuildPaymentFlatUniqueId.mockReturnValue(UNIQUE_ID);
                mockGetBopFromFounderCode.mockReturnValue(Number(PROGRAM_CODE));
                jest.mocked(dataBretagneService.getMinistryEntity).mockReturnValue(MINISTRY_ENTITIES[0]);
            });

            afterAll(() => {
                [mockBuildFlatPaymentId, mockBuildPaymentFlatUniqueId, mockGetBopFromFounderCode].forEach(mock =>
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
                ).toThrow("Trying to create a FONJEP PaymentFlat without siret or ridet information");
            });

            it("should build unique ID", () => {
                FonjepEntityAdapter.toFonjepPaymentFlat(
                    { payment: VERSEMENT_ENTITY, position: POSTE_ENTITY, thirdParty: TIERS_ENTITY },
                    DATA_BRETAGNE_RECORDS,
                );
                const SIRET = new Siret(TIERS_ENTITY.siretOuRidet as string);
                const SIREN = SIRET.toSiren();
                expect(mockBuildPaymentFlatUniqueId).toHaveBeenCalledWith({
                    idVersement: PAYMENT_ID,
                    exerciceBudgetaire: POSTE_ENTITY.annee as number,
                    typeIdEtablissementBeneficiaire: "siret",
                    idEtablissementBeneficiaire: SIRET,
                    typeIdEntrepriseBeneficiaire: "siren",
                    idEntrepriseBeneficiaire: SIREN,
                    amount: VERSEMENT_ENTITY.montantPaye,
                    operationDate: VERSEMENT_ENTITY.dateVersement,
                    centreFinancierCode: GenericAdapter.NOT_APPLICABLE_VALUE,
                    centreFinancierLibelle: GenericAdapter.NOT_APPLICABLE_VALUE,
                    attachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
                    regionAttachementComptable: GenericAdapter.NOT_APPLICABLE_VALUE,
                    ej: GenericAdapter.NOT_APPLICABLE_VALUE,
                    actionCode: GenericAdapter.NOT_APPLICABLE_VALUE,
                    actionLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
                    activityCode: GenericAdapter.NOT_APPLICABLE_VALUE,
                    activityLabel: GenericAdapter.NOT_APPLICABLE_VALUE,
                    provider: "fonjep",
                    programName: DATA_BRETAGNE_RECORDS.programs[Number(PROGRAM_CODE)].label_programme,
                    programNumber: DATA_BRETAGNE_RECORDS.programs[Number(PROGRAM_CODE)].code_programme,
                    mission: DATA_BRETAGNE_RECORDS.programs[Number(PROGRAM_CODE)].mission,
                    ministry: MINISTRY_ENTITIES[0]?.nom_ministere || null,
                    ministryAcronym: MINISTRY_ENTITIES[0]?.sigle_ministere || null,
                });
            });

            it("should build payment ID", () => {
                FonjepEntityAdapter.toFonjepPaymentFlat(
                    { payment: VERSEMENT_ENTITY, position: POSTE_ENTITY, thirdParty: TIERS_ENTITY },
                    DATA_BRETAGNE_RECORDS,
                );
                expect(mockBuildFlatPaymentId).toHaveBeenCalledWith({
                    thirdParty: TIERS_ENTITY,
                    position: POSTE_ENTITY,
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

        describe("buildFlatPaymentId", () => {
            const SHORT_DATE = "2024-06-12";
            let mockGetConventionDate: jest.SpyInstance;

            beforeEach(() => {
                jest.mocked(DateHelper.getShortISODate).mockReturnValue(SHORT_DATE);
                mockGetConventionDate = jest
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .spyOn(FonjepEntityAdapter as any, "getConventionDate")
                    .mockReturnValue(new Date(SHORT_DATE));
            });

            afterAll(() => {
                mockGetConventionDate.mockRestore();
            });

            it("return idVersement", () => {
                // @ts-expect-error: test private method
                const actual = FonjepEntityAdapter.buildFlatPaymentId({
                    thirdParty: TIERS_ENTITY,
                    position: POSTE_ENTITY,
                });
                expect(actual).toMatchSnapshot();
            });

            it("calls getConventionDate", () => {
                // @ts-expect-error: test private method
                FonjepEntityAdapter.buildFlatPaymentId({
                    thirdParty: TIERS_ENTITY,
                    position: POSTE_ENTITY,
                });
                expect(mockGetConventionDate).toHaveBeenCalledWith(POSTE_ENTITY);
            });
        });

        describe("getConventionDate", () => {
            beforeAll(() => {
                jest.mocked(DateHelper.modifyDateYear).mockReturnValue(new Date("2020-12-31"));
            });

            afterAll(() => {
                jest.mocked(DateHelper.modifyDateYear).mockReset();
            });

            it("calls modifyDateYear", () => {
                // @ts-expect-error: test private method
                FonjepEntityAdapter.getConventionDate(POSTE_ENTITY);
                expect(DateHelper.modifyDateYear).toHaveBeenCalledWith(POSTE_ENTITY.dateFinTriennalite, -3);
            });

            it("throws error if position has no dateFinTriennalite", () => {
                expect(() =>
                    // @ts-expect-error: test private method
                    FonjepEntityAdapter.getConventionDate({ ...POSTE_ENTITY, dateFinTriennalite: undefined }),
                ).toThrow("We can't create FONJEP PaymentFlat without dateFinTriennalite");
            });
        });

        describe("buildPaymentFlatUniqueId", () => {
            // let mockGetConventionDate
            beforeEach(() => {
                jest.mocked(DateHelper.getShortISODate).mockReturnValue("2023-07-12");
            });

            afterAll(() => {
                jest.mocked(DateHelper.getShortISODate).mockReset();
            });

            it("return idVersement", () => {
                const { uniqueId, ...partialPaymentFlat } = FONJEP_PAYMENT_FLAT_ENTITY;
                // @ts-expect-error: test private method
                const actual = FonjepEntityAdapter.buildPaymentFlatUniqueId(partialPaymentFlat);
                expect(actual).toMatchSnapshot();
            });
        });

        describe("toFonjepApplicationFlat", () => {
            const POSITION: FonjepPosteEntity = { ...POSTE_ENTITY };
            const BENEFICIARY: FonjepTiersEntity = { ...TIERS_ENTITY };
            const ALLOCATOR: FonjepTiersEntity = { ...TIERS_ENTITY, siretOuRidet: "20000000000001" };
            const INSTRUCTOR: FonjepTiersEntity = { ...TIERS_ENTITY, siretOuRidet: "30000000000001" };
            const SCHEME: FonjepDispositifEntity = { ...DISPOSITIF_ENTITY };

            let mockGetConventionDate: jest.SpyInstance;
            let mockGetIdentifierType: jest.SpyInstance;
            let mockBuildFlatPaymentId: jest.SpyInstance;

            beforeEach(() => {
                mockGetIdentifierType = jest
                    .spyOn(EstablishmentIdentifier, "getIdentifierType")
                    .mockReturnValue("siret");
                mockGetConventionDate = jest
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .spyOn(FonjepEntityAdapter as any, "getConventionDate")
                    .mockReturnValue(new Date("2021-12-31"));
                mockBuildFlatPaymentId = jest
                    // mock private static method
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .spyOn(FonjepEntityAdapter as any, "buildFlatPaymentId")
                    .mockReturnValue(PAYMENT_ID);
                jest.mocked(DateHelper.getShortISODate).mockReturnValue("2021-12-31");
            });

            afterEach(() => {
                mockGetConventionDate.mockReset();
            });

            it("build payment id", () => {
                FonjepEntityAdapter.toFonjepApplicationFlat({
                    position: POSITION,
                    beneficiary: BENEFICIARY,
                    allocator: ALLOCATOR,
                    instructor: INSTRUCTOR,
                    scheme: SCHEME,
                });
                expect(mockBuildFlatPaymentId).toHaveBeenCalledWith({ position: POSITION, thirdParty: BENEFICIARY });
            });

            it("return application flat entity", () => {
                const actual = FonjepEntityAdapter.toFonjepApplicationFlat({
                    position: POSITION,
                    beneficiary: BENEFICIARY,
                    allocator: ALLOCATOR,
                    instructor: INSTRUCTOR,
                    scheme: SCHEME,
                });
                expect(actual).toMatchSnapshot();
            });

            it("throws error if position has no budgetary year", () => {
                expect(() =>
                    FonjepEntityAdapter.toFonjepApplicationFlat({
                        position: { ...POSITION, annee: null },
                        beneficiary: BENEFICIARY,
                        allocator: ALLOCATOR,
                        instructor: INSTRUCTOR,
                        scheme: SCHEME,
                    }),
                ).toThrow("FONJEP ApplicationFlat must have a budgetary year");
            });

            it("throws error if beneficiary has no siret or ridet", () => {
                expect(() =>
                    FonjepEntityAdapter.toFonjepApplicationFlat({
                        position: POSITION,
                        beneficiary: { ...BENEFICIARY, siretOuRidet: null },
                        allocator: ALLOCATOR,
                        instructor: INSTRUCTOR,
                        scheme: SCHEME,
                    }),
                ).toThrow("FONJEP ApplicationFlat must have a beneficiary siret or ridet");
            });

            it("returns null if beneficiary has an invalid siret or ridet", () => {
                mockGetIdentifierType.mockReturnValue(null);
                const expected = null;
                const actual = FonjepEntityAdapter.toFonjepApplicationFlat({
                    position: POSITION,
                    beneficiary: BENEFICIARY,
                    allocator: ALLOCATOR,
                    instructor: INSTRUCTOR,
                    scheme: SCHEME,
                });
                expect(actual).toEqual(expected);
            });
        });
    });
});
