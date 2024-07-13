import DataBretagneRefProgrammationAdapter from "./DataBretagneRefProgrammationAdapter";
import { DataBretagnenRefProgrammationDto } from "./DataBretagneDto";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";

describe("DataBretagneRefProgrammationAdapter", () => {
    describe("toEntity", () => {
        it("should convert DataBretagnenRefProgrammationDto to RefProgrammationEntity", () => {
            const dto: DataBretagnenRefProgrammationDto = {
                code: "code",
                code_programme: "163",
                label: "Label",
            };
            const result = DataBretagneRefProgrammationAdapter.toEntity(dto);

            expect(result).toBeInstanceOf(RefProgrammationEntity);
            expect(result.libelle_activite).toEqual(dto.label);
            expect(result.code_activite).toEqual(dto.code);
            expect(result.code_programme.toString()).toBe(dto.code_programme);
        });
    });
});
