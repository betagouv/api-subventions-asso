import {
    DataBretagneDomaineFonctionnelMapper,
    DataBretagneMinistryMapper,
    DataBretagneProgrammeMapper,
    DataBretagneRefProgrammationMapper,
} from "./data-bretagne.mapper";
import DomaineFonctionnelEntity from "../../../entities/DomaineFonctionnelEntity";
import MinistryEntity from "../../../entities/MinistryEntity";
import StateBudgetProgramEntity from "../../../entities/StateBudgetProgramEntity";
import RefProgrammationEntity from "../../../entities/RefProgrammationEntity";
import { DTOS, DTOS_WITH_NULLS } from "./__fixtures__/DataBretagne.fixture";

describe("DataBretagneAdapter", () => {
    const expectedEntityDTOS = {
        domaineFonct: new DomaineFonctionnelEntity("Label", "code", 163),
        ministry: new MinistryEntity("sigle_ministere", "code", "label"),
        programme: new StateBudgetProgramEntity("label_theme", "label", "code_ministere", 163),
        refProgrammation: new RefProgrammationEntity("label", "code", 163),
    };

    const expectedEntityDTOS_WITH_NULLS = {
        domaineFonct: new DomaineFonctionnelEntity("Label", "code", null),
        ministry: new MinistryEntity(null, "code", "label"),
        programme: new StateBudgetProgramEntity("label_theme", "label", "code_ministere", 163),
        refProgrammation: new RefProgrammationEntity("label", "code", 163),
    };

    describe.each([
        ["domaineFonct", DataBretagneDomaineFonctionnelMapper, DomaineFonctionnelEntity],
        ["ministry", DataBretagneMinistryMapper, MinistryEntity],
        ["programme", DataBretagneProgrammeMapper, StateBudgetProgramEntity],
        ["refProgrammation", DataBretagneRefProgrammationMapper, RefProgrammationEntity],
    ])("with %s", (collection, Adapter, entity) => {
        it("should convert DTOS to Entity", () => {
            const result = Adapter.toEntity(DTOS[collection]);
            expect(result).toBeInstanceOf(entity);
        });

        it("should return the expected entity", () => {
            const result = Adapter.toEntity(DTOS[collection]);
            expect(result).toEqual(expectedEntityDTOS[collection]);
        });

        it("should convert DTOS_WITH_NULLS to Entity", () => {
            const result = Adapter.toEntity(DTOS_WITH_NULLS[collection]);
            expect(result).toBeInstanceOf(entity);
        });

        it("should return the expected entity", () => {
            const result = Adapter.toEntity(DTOS_WITH_NULLS[collection]);
            expect(result).toEqual(expectedEntityDTOS_WITH_NULLS[collection]);
        });
    });
});
