import Ridet from "../../../../identifierObjects/Ridet";
import Siret from "../../../../identifierObjects/Siret";
import Tahitiet from "../../../../identifierObjects/Tahitiet";
import { BRANCHE_ACCEPTED } from "../../../../shared/ChorusBrancheAccepted";
import { GenericParser } from "../../../../shared/GenericParser";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { santitizeFloat } from "../../../../shared/helpers/NumberHelper";
import { ChorusDto } from "../@types/ChorusDto";
import ChorusFseEntity from "../entities/ChorusFseEntity";

export class ChorusFseMapper {
    private static getIdentifier(dto: ChorusDto): Siret | Ridet | Tahitiet {
        const error = new Error("Error in Chorus format. No siret, ridet or tahitiet");
        const siret = dto["Code taxe 1"];
        const ridetOrTahitiet = dto["No TVA 3 (COM-RIDET ou TAHITI)"];
        if (siret === "#") {
            if (Ridet.isRidet(ridetOrTahitiet)) return new Ridet(ridetOrTahitiet);
            else if (Tahitiet.isTahitiet(ridetOrTahitiet)) return new Tahitiet(ridetOrTahitiet);
            else throw error;
        } else {
            if (Siret.isSiret(siret)) return new Siret(siret);
            else throw error;
        }
    }

    static dtoToEntity(dto: ChorusDto): ChorusFseEntity {
        const branchCode = dto["Branche CODE"];
        if (!BRANCHE_ACCEPTED[branchCode]) {
            throw new Error(`The branch ${branchCode} is not accepted in data`);
        }

        const amount = santitizeFloat(dto["Montant payé"]);
        if (isNaN(amount)) {
            throw new Error(`Amount is not a number`);
        }

        const operationDate = GenericParser.getDateFromXLSX(dto["Date de dernière opération sur la DP"]);
        if (!isValidDate(operationDate)) {
            throw new Error(`Operation date is not a valid date`);
        }

        return {
            ej: dto["N° EJ"],
            ejPostNum: dto["N° poste EJ"],
            identifier: this.getIdentifier(dto),
            branch: dto["Branche"],
            branchCode,
            programRef: dto["Référentiel de programmation"],
            programRefCode: dto["Référentiel de programmation CODE"],
            paymentRequestNum: dto["N° DP"],
            paymentRequestPostNum: dto["N° poste DP"],
            societyCode: dto["Société"],
            budgetaryYear: dto["Exercice comptable"],
            paidSupplierId: dto["Fournisseur payé (DP)"],
            beneficiaryName: dto["Désignation de la structure"],
            financialCenter: dto["Centre financier"],
            financialCenterCode: dto["Centre financier CODE"],
            functionalDomain: dto["Domaine fonctionnel"],
            functionalDomainCode: dto["Domaine fonctionnel CODE"],
            amount,
            operationDate,
        };
    }
}
