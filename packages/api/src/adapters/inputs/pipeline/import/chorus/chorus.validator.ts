import { ChorusDto, ChorusFseDto } from "./chorus.dto";
import { isEJ } from "../../../../../shared/Validators";

export class ChorusValidator {
    private static validateEJ(ej: string) {
        if (!isEJ(ej)) {
            throw new Error(`Invalid EJ: ${ej}`);
        }
    }

    private static validateAmount(amount: number) {
        if (isNaN(amount)) {
            throw new Error(`Invalid amount`);
        }
    }

    private static validateOperationDate(operationDate: Date) {
        if (!(operationDate instanceof Date)) {
            throw new Error(`Invalid operation date`);
        }
    }

    // validate format, not data
    static validate(dto: ChorusDto) {
        this.hasMandatoryFields(dto);
        this.validateEJ(dto["N° EJ"]);
        this.validateAmount(dto["Montant payé"]);
        this.validateOperationDate(dto["Date de dernière opération sur la DP"]);

        return true;
    }

    /**
     * Checks for mandatory fields used to build unique ID
     */
    private static hasMandatoryFields(dto: ChorusDto) {
        // those fields are "mandatory" because they are used to build the unique ID
        const mandatoryFields = ["N° EJ", "N° poste EJ", "N° DP", "N° poste DP", "Société", "Exercice comptable"];
        for (const key of mandatoryFields) {
            if (!dto[key]) throw new Error("The DTO is missing mandatory fields");
        }
    }

    // validate format, not data
    static validateFse(dto: ChorusFseDto) {
        this.hasFseMandatoryFields(dto);
        this.validateAmount(dto["Montant payé"]);
        this.validateOperationDate(dto["Date de dernière opération sur la DP"]);

        return true;
    }

    /**
     * Checks for mandatory fields used in the unique index
     */
    private static hasFseMandatoryFields(dto: ChorusFseDto) {
        // those fields are "mandatory" because they are used to build the unique ID
        const mandatoryFields = ["N° DP", "N° poste DP", "Société", "Exercice comptable"];
        for (const key of mandatoryFields) {
            if (!dto[key]) throw new Error("The DTO is missing mandatory fields");
        }
    }
}
