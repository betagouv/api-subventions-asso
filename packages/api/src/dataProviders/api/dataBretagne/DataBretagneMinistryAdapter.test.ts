import DataBretagneMinistryAdapter from "./DataBretagneMinistryAdapter";
import { DataBretagneMinistryDto } from "./DataBretagneDto";
import MinistryEntity from "../../../entities/MinistryEntity";
import { cp } from "fs";

describe("DataBretagneMinistryAdapter", () => {
    describe("toEntity", () => {
        it("should convert DataBretagneMinistryDto to MinistryDto", () => {
            const dto: DataBretagneMinistryDto = {
                code: "code",
                label: "label",
                sigle_ministere: "sigle_ministere",
            };
            const result = DataBretagneMinistryAdapter.toEntity(dto);

            expect(result).toBeInstanceOf(MinistryEntity);
            expect(result.sigle_ministere).toEqual(dto.sigle_ministere);
            expect(result.code_ministere).toEqual(dto.code);
            expect(result.nom_ministere).toEqual(dto.label);
        });
    });
});
