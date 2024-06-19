import DataBretagneProgrammeAdapter from "./DataBretagneProgrammeAdapter";
import { DataBretagneProgrammeDto } from "./DataBretagneDto";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";

describe("DataBretagneProgrammeAdapter", () => {
    describe("toEntity", () => {
        it("should convert DataBretagneProgrammeDto to StateBudgetProgramEntity", () => {
            const dto: DataBretagneProgrammeDto = {
                label_theme: "Theme",
                label: "Label",
                code_ministere: "Ministere",
                code: "163",
            };

            const result = DataBretagneProgrammeAdapter.toEntity(dto);

            expect(result).toBeInstanceOf(StateBudgetProgramEntity);
            expect(result.mission).toEqual(dto.label_theme);
            expect(result.label_programme).toEqual(dto.label);
            expect(result.code_ministere).toEqual(dto.code_ministere);
            expect(result.code_programme.toString()).toBe(dto.code);
        });
    });
});
