const mockLabel = "NORMALIZED_LABEL";
const mockToStatus = jest.fn(() => mockLabel);

import OsirisMapper from "./osiris.mapper";
import OsirisEntity from "../../../../tests/modules/providers/osiris/__fixtures__/OsirisEntities";
import Ridet from "../../../identifier-objects/Ridet";
import { RIDET_STR } from "../../../../tests/__fixtures__/association.fixture";
import Siret from "../../../identifier-objects/Siret";
import OsirisActionEntity from "./entities/OsirisActionEntity";
import { GenericParser } from "../../../shared/GenericParser";
import * as osirisHelper from "./osiris.helper";

jest.mock("../../../shared/GenericParser");

jest.mock("../providers.mapper", () => ({
    toStatusFactory: () => mockToStatus,
    __esModule: true, // this property makes it work
}));

describe("OsirisMapper", () => {
    describe("toApplicationFlat", () => {
        let mockGetAssoIdType: jest.SpyInstance;
        let mockExcelDateToJSDate: jest.SpyInstance;
        let mockCleanRidet: jest.SpyInstance;
        let mockGetCofinancers: jest.SpyInstance;

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
            mockGetAssoIdType = jest.spyOn(osirisHelper, "getAssoIdType").mockReturnValue(Siret.getName());
            mockExcelDateToJSDate = jest
                .spyOn(GenericParser, "ExcelDateToJSDate")
                .mockReturnValue(new Date("2025-08-04"));
            mockCleanRidet = jest.spyOn(osirisHelper, "cleanRidet").mockReturnValue(RIDET_STR);
            mockGetCofinancers = jest.spyOn(osirisHelper, "getCofinancers").mockReturnValue(["CAF", "ARS", "DRAC"]);
        });

        afterAll(() => {
            [mockGetAssoIdType, mockCleanRidet, mockGetCofinancers].map(mock => mock.mockRestore());
        });

        it("gets identifier type", () => {
            OsirisMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(mockGetAssoIdType).toHaveBeenCalledWith(OsirisEntity.association?.siret);
        });

        it("format excel date", () => {
            OsirisMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(mockExcelDateToJSDate).toHaveBeenCalledWith(OsirisEntity.dossier.dateReception);
        });

        it("retrieves the real ridet from the one disguised in siret by osiris", () => {
            mockGetAssoIdType.mockReturnValue(Ridet.getName());
            OsirisMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(mockCleanRidet).toHaveBeenCalledWith(OsirisEntity.association?.siret);
        });

        it("gets cofinancers", () => {
            OsirisMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(mockGetCofinancers).toHaveBeenCalledWith(ACTIONS);
        });

        it("returns application flat with default date", () => {
            jest.useFakeTimers().setSystemTime(new Date("2025-08-06"));
            const actual = OsirisMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(actual).toMatchSnapshot();
            jest.useFakeTimers().useRealTimers();
        });

        it("returns application flat with date from object id", () => {
            const actual = OsirisMapper.toApplicationFlat(OsirisEntity, ACTIONS);
            expect(actual).toMatchSnapshot();
        });

        it("nullify idVersement if EJ is missing", () => {
            const actual = OsirisMapper.toApplicationFlat(
                { ...OsirisEntity, dossier: { ...OsirisEntity.dossier, ej: undefined } },
                ACTIONS,
            );
            expect(actual).toMatchSnapshot();
        });
    });
});
