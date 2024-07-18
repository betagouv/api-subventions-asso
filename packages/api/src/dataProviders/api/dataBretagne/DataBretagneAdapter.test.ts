import {
    DataBretagneDomaineFonctionnelAdapter,
    DataBretagneMinistryAdapter,
    DataBretagneProgrammeAdapter,
    DataBretagneRefProgrammationAdapter,
} from "./DataBretagneAdapter";
import {
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneProgrammeDto,
    DataBretagneRefProgrammationDto,
} from "./DataBretagneDto";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";

describe("DataBretagneAdapter", () => {
    const dto = {
        domaineFonct: {
            code: "code",
            code_programme: "163",
            label: "Label",
        } as DataBretagneDomaineFonctionnelDto,

        ministry: {
            code: "code",
            label: "label",
            sigle_ministere: "sigle_ministere",
        } as DataBretagneMinistryDto,

        programme: {
            code: "code",
            code_ministere: "code_ministere",
            label: "label",
            label_theme: "label_theme",
        } as DataBretagneProgrammeDto,

        refProgrammation: {
            code: "code",
            code_programme: "code_programme",
            label: "label",
        } as DataBretagneRefProgrammationDto,
    };

    const expectedEntity = {
        domaineFonct: new DomaineFonctionnelEntity(
            dto.domaineFonct.label,
            dto.domaineFonct.code,
            parseInt(dto.domaineFonct.code_programme ?? "0", 10),
        ),
        ministry: new MinistryEntity(dto.ministry.sigle_ministere ?? "", dto.ministry.code, dto.ministry.label),
        programme: new StateBudgetProgramEntity(
            dto.programme.label_theme,
            dto.programme.label,
            dto.programme.code_ministere,
            parseInt(dto.programme.code, 10),
        ),
        refProgrammation: new RefProgrammationEntity(
            dto.refProgrammation.label,
            dto.refProgrammation.code,
            parseInt(dto.refProgrammation.code_programme ?? "0", 10),
        ),
    };

    describe.each([
        ["domaineFonct", DataBretagneDomaineFonctionnelAdapter, DomaineFonctionnelEntity],
        ["ministry", DataBretagneMinistryAdapter, MinistryEntity],
        ["programme", DataBretagneProgrammeAdapter, StateBudgetProgramEntity],
        ["refProgrammation", DataBretagneRefProgrammationAdapter, RefProgrammationEntity],
    ])("with %s", (collection, Adapter, entity) => {
        it("should convert Dto to Entity", () => {
            const result = Adapter.toEntity(dto[collection]);
            expect(result).toBeInstanceOf(entity);
        });

        it("should return the expected entity", () => {
            const result = Adapter.toEntity(dto[collection]);
            expect(result).toEqual(expectedEntity[collection]);
        });
    });
});
