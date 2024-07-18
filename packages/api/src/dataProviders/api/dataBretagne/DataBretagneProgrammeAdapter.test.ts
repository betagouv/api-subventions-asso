import DataBretagneProgrammeAdapter from "./DataBretagneProgrammeAdapter";
import { DataBretagneProgrammeDto } from "./DataBretagneDto";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";

describe("DataBretagneProgrammeAdapter", () => {
    describe("toEntity", () => {
        const dto: DataBretagneProgrammeDto = {
            label_theme: "Theme",
            label: "Label",
            code_ministere: "Ministere",
            code: "163",
        };

        it("should convert DataBretagneProgrammeDto to StateBudgetProgramEntity", () => {
            const result = DataBretagneProgrammeAdapter.toEntity(dto);

            expect(result).toBeInstanceOf(StateBudgetProgramEntity);
        });

        it("should return the expected entity", () => {
            const expected = new StateBudgetProgramEntity(
                dto.label_theme,
                dto.label,
                dto.code_ministere,
                parseInt(dto.code, 10),
            );

            const result = DataBretagneProgrammeAdapter.toEntity(dto);

            expect(result).toEqual(expected);
        });
    });
});
