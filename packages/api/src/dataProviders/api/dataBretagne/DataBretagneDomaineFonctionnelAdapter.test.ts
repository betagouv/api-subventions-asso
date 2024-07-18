import DataBretagneDomaineFonctionnelAdapter from "./DataBretagneDomaineFonctionnelAdapter";
import { DataBretagneDomaineFonctionnelDto } from "./DataBretagneDto";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";

describe("DataBretagneDomaineFonctionnelAdapter", () => {
    describe("toEntity", () => {
        const dto: DataBretagneDomaineFonctionnelDto = {
            code: "code",
            code_programme: "163",
            label: "Label",
        };

        it("should convert DataBretagneDomaineFonctionnel Dto to DomaineFonctionnelEntity", () => {
            const result = DataBretagneDomaineFonctionnelAdapter.toEntity(dto);
            expect(result).toBeInstanceOf(DomaineFonctionnelEntity);
        });

        it("should return the expected entity", () => {
            const expected = new DomaineFonctionnelEntity(dto.label, dto.code, parseInt(dto.code_programme, 10));
            const result = DataBretagneDomaineFonctionnelAdapter.toEntity(dto);

            expect(result).toEqual(expected);
        });
    });
});
