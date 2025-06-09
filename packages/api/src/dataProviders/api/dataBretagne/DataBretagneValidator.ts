import {
    DataBretagneDomaineFonctionnelDto,
    DataBretagneMinistryDto,
    DataBretagneProgrammeDto,
    DataBretagneRefProgrammationDto,
} from "./DataBretagneDto";

export class DataBretagneValidatorHelper {
    static dropDuplicates<T>(listDTO: T[]): T[] {
        /*
        This method is used to drop duplicated DTO from a list of DTOs.
        */

        return [...new Set(listDTO)];
    }

    /**
     * Finds duplicate values of a specified attribute in a collection to identify data incoherence.
     * @param collection - The list to search for duplicates.
     * @param key - The attribute to check for duplicates.
     * @returns A Set containing the attributes values found more than once. An error is printed for each duplicate found.
     */
    static findDuplicateByKey<T, K extends keyof T>(collection: T[], key: K): Set<T[K]> {
        const uniqueValues = new Set<T[K]>();
        const duplicates = new Set<T[K]>();

        let value: T[K];
        for (const item of collection) {
            value = key == undefined ? (item as unknown as T[K]) : item[key];

            if (uniqueValues.has(value)) {
                duplicates.add(value);
                console.error(`Duplicate value found for code : ${String(value)}`);
            }
            uniqueValues.add(value);
        }
        return duplicates;
    }

    static validateNotNulls<T>(dto: T, requiredAttributes: string[]): boolean {
        for (const attribute of requiredAttributes) {
            if (!dto[attribute]) {
                return false;
            }
        }
        return true;
    }

    static sortDataByValidity<T>(
        dtoListWithoutDuplicates: T[],
        duplicatesCode: Set<string>,
        requiredAttributes: string[],
    ): { valids: T[]; invalids: T[] } {
        return dtoListWithoutDuplicates.reduce<{
            valids: T[];
            invalids: T[];
        }>(
            (acc, currentLine) => {
                if (this.validateNotNulls(currentLine, requiredAttributes) && !duplicatesCode.has(currentLine["code"]))
                    acc["valids"].push(currentLine);
                else acc["invalids"].push(currentLine);
                return acc;
            },
            { valids: [], invalids: [] },
        );
    }
}

export class DataBretagneDomaineFonctionnelValidator extends DataBretagneValidatorHelper {
    static validate(dtoList: DataBretagneDomaineFonctionnelDto[]): {
        valids: DataBretagneDomaineFonctionnelDto[];
        invalids: DataBretagneDomaineFonctionnelDto[];
    } {
        const dtoListWithoutDuplicates = this.dropDuplicates<DataBretagneDomaineFonctionnelDto>(dtoList);
        const duplicatesCode = this.findDuplicateByKey<DataBretagneDomaineFonctionnelDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        return this.sortDataByValidity<DataBretagneDomaineFonctionnelDto>(dtoListWithoutDuplicates, duplicatesCode, [
            "code",
            "label",
        ]);
    }
}

export class DataBretagneProgrammeValidator extends DataBretagneValidatorHelper {
    static validate(dtoList: DataBretagneProgrammeDto[]): {
        valids: DataBretagneProgrammeDto[];
        invalids: DataBretagneProgrammeDto[];
    } {
        const dtoListWithoutDuplicates = this.dropDuplicates<DataBretagneProgrammeDto>(dtoList);
        const duplicatesCode = this.findDuplicateByKey<DataBretagneProgrammeDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        return this.sortDataByValidity<DataBretagneProgrammeDto>(dtoListWithoutDuplicates, duplicatesCode, [
            "code",
            "label",
        ]);
    }
}

export class DataBretagneRefProgrammationValidator extends DataBretagneValidatorHelper {
    static validate(dtoList: DataBretagneRefProgrammationDto[]): {
        valids: DataBretagneRefProgrammationDto[];
        invalids: DataBretagneRefProgrammationDto[];
    } {
        const dtoListWithoutDuplicates = this.dropDuplicates<DataBretagneRefProgrammationDto>(dtoList);
        const duplicatesCode = this.findDuplicateByKey<DataBretagneRefProgrammationDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        return this.sortDataByValidity<DataBretagneRefProgrammationDto>(dtoListWithoutDuplicates, duplicatesCode, [
            "code",
            "label",
        ]);
    }
}

export class DataBretagneMinistryValidator extends DataBretagneValidatorHelper {
    static validate(dtoList: DataBretagneMinistryDto[]): {
        valids: DataBretagneMinistryDto[];
        invalids: DataBretagneMinistryDto[];
    } {
        const dtoListWithoutDuplicates = this.dropDuplicates<DataBretagneMinistryDto>(dtoList);
        const duplicatesCode = this.findDuplicateByKey<DataBretagneMinistryDto, "code">(
            dtoListWithoutDuplicates,
            "code",
        );

        return this.sortDataByValidity<DataBretagneMinistryDto>(dtoListWithoutDuplicates, duplicatesCode, [
            "code",
            "label",
        ]);
    }
}
