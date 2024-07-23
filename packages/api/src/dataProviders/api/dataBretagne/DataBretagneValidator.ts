import {
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneProgrammeDto,
    DataBretagneRefProgrammationDto,
} from "./DataBretagneDto";

export function dropDuplicates<T>(listDTO: T[]) {
    return [...new Set(listDTO)];
}

export function findDuplicateAttribute<T, K extends keyof T>(collection: T[], attribute: K): T[K][] {
    const uniqueValues = new Set<T[K]>();
    const duplicates: T[K][] = []; // faire directement un set

    let value: T[K];
    for (const item of collection) {
        if (attribute === undefined) {
            value = item as unknown as T[K];
        } else {
            value = item[attribute] as unknown as T[K];
        }

        if (uniqueValues.has(value)) {
            //    duplicates.add(value);
            console.error(`Duplicate value found for code : ${String(value)}`);
        }
        uniqueValues.add(value);
    }
    return [...new Set(duplicates)];
}

export class DataBretagneDomaineFonctionnelValidator {
    static validate(dtoList: DataBretagneDomaineFonctionnelDto[]) {
        const dtoListWithoutDuplicates = dropDuplicates<DataBretagneDomaineFonctionnelDto>(dtoList);
        const duplicatesCode = findDuplicateAttribute<DataBretagneDomaineFonctionnelDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        const sortedData = dtoListWithoutDuplicates.reduce<{
            valids: DataBretagneDomaineFonctionnelDto[];
            invalids: DataBretagneDomaineFonctionnelDto[];
        }>(
            (acc, currentLine) => {
                if (this.validateNotNulls(currentLine) && !duplicatesCode.includes(currentLine.code))
                    acc["valids"].push(currentLine);
                else acc["invalids"].push(currentLine);
                return acc;
            },
            { valids: [], invalids: [] },
        );
        return sortedData;
    }

    static validateNotNulls(dto: DataBretagneDomaineFonctionnelDto) {
        if (!dto.code) throw new Error("code is required");
        if (!dto.label) throw new Error("label is required");
        return true;
    }
}

export class DataBretagneProgrammeValidator {
    static validate(dtoList: DataBretagneProgrammeDto[]) {
        const dtoListWithoutDuplicates = dropDuplicates<DataBretagneProgrammeDto>(dtoList);
        const duplicatesCode = findDuplicateAttribute<DataBretagneProgrammeDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        const sortedData = dtoListWithoutDuplicates.reduce<{
            valids: DataBretagneProgrammeDto[];
            invalids: DataBretagneProgrammeDto[];
        }>(
            (acc, currentLine) => {
                if (this.validateNotNulls(currentLine) && !duplicatesCode.includes(currentLine.code))
                    acc["valids"].push(currentLine);
                else acc["invalids"].push(currentLine);
                return acc;
            },
            { valids: [], invalids: [] },
        );
        return sortedData;
    }

    static validateNotNulls(dto: DataBretagneProgrammeDto) {
        if (!dto.code) throw new Error("code is required");
        if (!dto.label) throw new Error("label is required");
        if (!dto.label_theme) throw new Error("label_theme is required");
        if (!dto.code_ministere) throw new Error("code_ministere is required");
        return true;
    }
}

export class DataBretagneRefProgrammationValidator {
    static validate(dtoList: DataBretagneRefProgrammationDto[]) {
        const dtoListWithoutDuplicates = dropDuplicates<DataBretagneRefProgrammationDto>(dtoList);
        const duplicatesCode = findDuplicateAttribute<DataBretagneRefProgrammationDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        const sortedData = dtoListWithoutDuplicates.reduce<{
            valids: DataBretagneRefProgrammationDto[];
            invalids: DataBretagneRefProgrammationDto[];
        }>(
            (acc, currentLine) => {
                if (this.validateNotNulls(currentLine) && !duplicatesCode.includes(currentLine.code))
                    acc["valids"].push(currentLine);
                else acc["invalids"].push(currentLine);
                return acc;
            },
            { valids: [], invalids: [] },
        );
        return sortedData;
    }

    static validateNotNulls(dto: DataBretagneRefProgrammationDto) {
        if (!dto.code) throw new Error("code is required");
        if (!dto.label) throw new Error("label is required");

        return true;
    }
}

export class DataBretagneMinistryValidator {
    static validate(dtoList: DataBretagneMinistryDto[]) {
        const dtoListWithoutDuplicates = dropDuplicates<DataBretagneMinistryDto>(dtoList);
        const duplicatesCode = findDuplicateAttribute<DataBretagneMinistryDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        const sortedData = dtoListWithoutDuplicates.reduce<{
            valids: DataBretagneMinistryDto[];
            invalids: DataBretagneMinistryDto[];
        }>(
            (acc, currentLine) => {
                if (this.validateNotNulls(currentLine) && !duplicatesCode.includes(currentLine.code))
                    acc["valids"].push(currentLine);
                else acc["invalids"].push(currentLine);
                return acc;
            },
            { valids: [], invalids: [] },
        );
        return sortedData;
    }

    static validateNotNulls(dto: DataBretagneMinistryDto) {
        if (!dto.code) throw new Error("code is required");
        if (!dto.label) throw new Error("label is required");

        return true;
    }
}
