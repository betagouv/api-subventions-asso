const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

import OsirisRequestMapper from "./osiris-request.mapper";
import OsirisEntity from "../../../../../tests/modules/providers/osiris/__fixtures__/OsirisEntities";
import Ridet from "../../../../identifierObjects/Ridet";
import DEFAULT_ASSOCIATION, { RIDET_STR } from "../../../../../tests/__fixtures__/association.fixture";
import Siret from "../../../../identifierObjects/Siret";
import OsirisActionEntity from "../entities/OsirisActionEntity";
import OsirisRequestEntity from "../entities/OsirisRequestEntity";
import { GenericParser } from "../../../../shared/GenericParser";
jest.mock("../../../../shared/GenericParser");

jest.mock("../../providers.mapper", () => ({
    toStatusFactory: () => mockToStatus,
    __esModule: true, // this property makes it work
}));

describe("OsirisRequestAdapter", () => {
    describe("getAssoIdType", () => {
        it.each`
            osirisRidet
            ${"990001234567891"}
            ${"99001234567891"}
        `("returns ridet", ({ osirisRidet }) => {
            const expected = Ridet.getName();
            const actual = OsirisRequestMapper.getAssoIdType(osirisRidet);
            expect(actual).toEqual(expected);
        });

        it("returns siret", () => {
            const expected = Siret.getName();
            const actual = OsirisRequestMapper.getAssoIdType(DEFAULT_ASSOCIATION.siret);
            expect(actual).toEqual(expected);
        });
    });

    describe("cleanRidet", () => {
        it.each`
            osirisRidet
            ${"990001234567891"}
            ${"99001234567891"}
        `("returns well formatted ridet", ({ osirisRidet }) => {
            const expected = "1234567891";
            const actual = OsirisRequestMapper.cleanRidet(osirisRidet);
            expect(actual).toEqual(expected);
        });

        it("throws error if cleaned ridet is not valid", () => {
            expect(() => OsirisRequestMapper.cleanRidet("99000123456")).toThrow("Cleaned Ridet is not valid");
        });
    });

    describe("getPluriannualYears", () => {
        it("returns years", () => {
            const expected = [2023, 2024, 2025];
            const actual = OsirisRequestMapper.getPluriannualYears({
                data: {
                    Dossier: { "Exercice Début": 2023, "Exercice Fin": 2025 },
                },
            } as OsirisRequestEntity);
            expect(actual).toEqual(expected);
        });
    });

    describe("getCofinancers", () => {
        it("returns array of unique cofinancers", () => {
            const expected = [
                "Direction départementale de Saône-et-Loire",
                "DRAC",
                "ARS",
                "Bourgogne-Franche-Comté",
                "Saône-et-Loire",
                "Politque de la ville",
                "CAF",
                "Aides privées",
            ];

            const actual = OsirisRequestMapper.getCofinancers([
                {
                    indexedInformations: {
                        // copied from real data
                        cofinanceurs:
                            "Direction départementale de Saône-et-Loire;DRAC;ARS;Bourgogne-Franche-Comté;Saône-et-Loire;Politque de la ville;CAF;",
                    },
                } as OsirisActionEntity,
                {
                    indexedInformations: {
                        cofinanceurs: "Politque de la ville;CAF;Aides privées;",
                    },
                } as OsirisActionEntity,
            ]);
            expect(actual).toEqual(expected);
        });

        it("returns empty array if no cofinancers", () => {
            const expected = [];

            const actual = OsirisRequestMapper.getCofinancers([
                {
                    indexedInformations: {
                        cofinanceurs: "",
                    },
                } as OsirisActionEntity,
                {
                    indexedInformations: {
                        cofinanceurs: "",
                    },
                } as OsirisActionEntity,
            ]);
            expect(actual).toEqual(expected);
        });
    });

    describe("toApplicationFlat", () => {
        let mockGetAssoIdType;
        let mockExcelDateToJSDate;
        let mockCleanRidet;
        let mockGetCofinancers;

        const ACTIONS = [
            {
                indexedInformations: {
                    // copied from real data
                    cofinanceurs:
                        "Direction départementale de Saône-et-Loire;DRAC;ARS;Bourgogne-Franche-Comté;Saône-et-Loire;Politque de la ville;CAF;",
                },
            } as OsirisActionEntity,
        ];

        beforeEach(() => {
            mockGetAssoIdType = jest.spyOn(OsirisRequestMapper, "getAssoIdType").mockReturnValue(Siret.getName());
            mockExcelDateToJSDate = jest
                .spyOn(GenericParser, "ExcelDateToJSDate")
                .mockReturnValue(new Date("2025-08-04"));
            mockCleanRidet = jest.spyOn(OsirisRequestMapper, "cleanRidet").mockReturnValue(RIDET_STR);
            mockGetCofinancers = jest
                .spyOn(OsirisRequestMapper, "getCofinancers")
                .mockReturnValue(["CAF", "ARS", "DRAC"]);
        });

        afterAll(() => {
            [mockGetAssoIdType, mockCleanRidet, mockGetCofinancers].map(mock => mock.mockRestore());
        });

        it("gets identifier type", () => {
            OsirisRequestMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(mockGetAssoIdType).toHaveBeenCalledWith(OsirisEntity.legalInformations.siret);
        });

        it("format excel date", () => {
            OsirisRequestMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            // @ts-expect-error: data is defined in mock
            expect(mockExcelDateToJSDate).toHaveBeenCalledWith(OsirisEntity.data["Dossier"]["Date Reception"]);
        });

        it("retrieves the real ridet from the one disguised in siret by osiris", () => {
            mockGetAssoIdType.mockReturnValue(Ridet.getName());
            OsirisRequestMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(mockCleanRidet).toHaveBeenCalledWith(OsirisEntity.legalInformations.siret);
        });

        it("gets cofinancers", () => {
            OsirisRequestMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(mockGetCofinancers).toHaveBeenCalledWith(ACTIONS);
        });

        it("returns application flat with default date", () => {
            jest.useFakeTimers().setSystemTime(new Date("2025-08-06"));
            const actual = OsirisRequestMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(actual).toMatchSnapshot();
            jest.useFakeTimers().useRealTimers();
        });

        it("returns application flat with date from object id", () => {
            const actual = OsirisRequestMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(actual).toMatchSnapshot();
        });

        it("nullify idVersement if EJ is missing", () => {
            const actual = OsirisRequestMapper.toApplicationFlat(
                { ...OsirisEntity, providerInformations: { ...OsirisEntity.providerInformations, ej: undefined } },
                ACTIONS,
            );
            expect(actual).toMatchSnapshot();
        });
    });
});
