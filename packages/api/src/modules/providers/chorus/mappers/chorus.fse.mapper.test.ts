import { GenericParser } from "../../../../shared/GenericParser";
import { santitizeFloat } from "../../../../shared/helpers/NumberHelper";
import { PARSED_DATA } from "../__fixtures__/ChorusFixtures";
import { ChorusFseMapper } from "./chorus.fse.mapper";

jest.mock("../../../../shared/GenericParser");
jest.mock("../../../../shared/helpers/NumberHelper");

describe("ChorusFseMapper", () => {
    const CHORUS_DTO = PARSED_DATA[0];

    describe("dtoToEntity", () => {
        beforeEach(() => {
            jest.mocked(santitizeFloat).mockReturnValue(CHORUS_DTO["Montant payé"]);
            jest.mocked(GenericParser.getDateFromXLSX).mockReturnValue(new Date("2026-03-03"));
        });

        it("should sanitize amount", () => {
            ChorusFseMapper.dtoToEntity(CHORUS_DTO);
            expect(santitizeFloat).toHaveBeenCalledWith(CHORUS_DTO["Montant payé"]);
        });

        it("should format XLSX date", () => {
            ChorusFseMapper.dtoToEntity(CHORUS_DTO);
            expect(GenericParser.getDateFromXLSX).toHaveBeenCalledWith(
                CHORUS_DTO["Date de dernière opération sur la DP"],
            );
        });

        it("returns ChorusFseEntity", () => {
            const actual = ChorusFseMapper.dtoToEntity(CHORUS_DTO);
            expect(actual).toMatchSnapshot();
        });
    });
});
