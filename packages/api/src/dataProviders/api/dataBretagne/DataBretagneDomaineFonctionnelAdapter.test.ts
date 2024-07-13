import DataBretagneDomaineFonctionnelAdapter from "./DataBretagneDomaineFonctionnelAdapter";
import { DataBretagneDomaineFonctionnelDto } from "./DataBretagneDto";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";

describe("DataBretagneDomaineFonctionnelAdapter", () => {
    describe("toEntity", () => {
        it("should convert DataBretagneDomaineFonctionnel Dto to DomaineFonctionnelEntity", () => {
            const dto: DataBretagneDomaineFonctionnelDto = {
                code: "code",
                code_programme: "163",
                label: "Label",
            };
            const result = DataBretagneDomaineFonctionnelAdapter.toEntity(dto);

            expect(result).toBeInstanceOf(DomaineFonctionnelEntity);
            expect(result.libelle_action).toEqual(dto.label);
            expect(result.code_action).toEqual(dto.code);
            // pourquoi en haut toEqual et en bas toBe ? J'ai
            // l'impression que dans ce cas to Be partout aurait été
            // plus approprié ? ou c'est juste interchangeable ?
            expect(result.code_programme.toString()).toBe(dto.code_programme);
        });
    });
});
