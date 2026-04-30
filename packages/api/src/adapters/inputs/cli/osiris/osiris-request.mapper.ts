import OsirisRequestDto, { OsirisRequestDtoValue } from "./osiris-request.dto";
import OsirisRequestEntity, {
    OsirisRequestCategory,
} from "../../../../modules/providers/osiris/entities/OsirisRequestEntity";

export default class OsirisRequestMapper {
    private static readonly CATEGORY_TRANSLATIONS = new Map<string, string>([["Dossier/action", "Dossier"]]);

    private static readonly CATEGORY_RENAMINGS = new Map<string, string>([
        ["coordonneesCorrespondancePublipostage", "coordonnees"],
    ]);

    private static readonly FIELD_RENAMINGS = new Map<string, string>([
        ["noRna", "rna"],
        ["noEj", "ej"],
        ["noSiret", "siret"],
        ["noDossierOsiris", "osirisId"],
        ["noDossierCompteAsso", "compteAssoId"],
        ["iBAN", "iban"],
        ["bIC", "bic"],
    ]);

    static toEntity(dto: OsirisRequestDto, exercise: number, updateDate = new Date()): OsirisRequestEntity {
        const entity = this.toCamelCaseNestedObject(dto);

        entity.dossier = {
            ...(entity.dossier || {}),
            exerciceBudgetaire: exercise,
        };

        return {
            ...entity,
            updateDate,
        } as OsirisRequestEntity;
    }

    private static toCamelCaseNestedObject(dto: OsirisRequestDto): Record<string, OsirisRequestCategory> {
        return Object.entries(dto).reduce(
            (entity, [category, values]) => {
                const normalizedCategory = this.CATEGORY_TRANSLATIONS.get(category) || category;
                const rawCategoryKey = this.toCamelCase(normalizedCategory);
                const categoryKey = this.CATEGORY_RENAMINGS.get(rawCategoryKey) || rawCategoryKey;

                const mappedValues = Object.entries(values || {}).reduce((acc, [header, value]) => {
                    const rawFieldKey = this.toCamelCase(header);
                    const fieldKey = this.FIELD_RENAMINGS.get(rawFieldKey) || rawFieldKey;

                    acc[fieldKey] = value as OsirisRequestDtoValue;

                    return acc;
                }, {} as OsirisRequestCategory);

                entity[categoryKey] = {
                    ...(entity[categoryKey] || {}),
                    ...mappedValues,
                };

                return entity;
            },
            {} as Record<string, OsirisRequestCategory>,
        );
    }

    private static toCamelCase(value: string): string {
        const normalized = value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/&/g, " et ")
            .replace(/°/g, "o")
            .replace(/[^a-zA-Z0-9]+/g, " ")
            .trim();

        const words = normalized.split(/\s+/).filter(Boolean);
        if (!words.length) return "";

        return words
            .map((word, index) => {
                const lower = word.toLowerCase();

                if (index === 0) return lower;

                return lower.charAt(0).toUpperCase() + lower.slice(1);
            })
            .join("");
    }
}
