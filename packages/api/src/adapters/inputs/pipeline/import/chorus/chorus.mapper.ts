import { Ridet, Siret, Tahitiet } from "../../../../../identifier-objects";
import ChorusEntity from "../../../../../modules/providers/chorus/entities/ChorusEntity";
import ChorusFseEntity from "../../../../../modules/providers/chorus/entities/ChorusFseEntity";
import { getMD5 } from "../../../../../shared/helpers/StringHelper";
import { ChorusDto, ChorusFseDto } from "./chorus.dto";

export class ChorusMapper {
    public static toEntity(dto: ChorusDto): ChorusEntity {
        const partial = {
            ej: dto["N° EJ"],
            numPosteEJ: dto["N° poste EJ"],
            siret: dto["Code taxe 1"],
            ridetOrTahitiet: dto["No TVA 3 (COM-RIDET ou TAHITI)"],
            codeBranche: dto["Branche CODE"],
            branche: dto["Branche"],
            activitee: dto["Référentiel de programmation"],
            codeActivitee: dto["Référentiel de programmation CODE"],
            numeroDemandePaiement: dto["N° DP"],
            numPosteDP: dto["N° poste DP"],
            codeSociete: dto["Société"],
            exercice: dto["Exercice comptable"],
            numeroTier: dto["Fournisseur payé (DP)"],
            nomStructure: dto["Désignation de la structure"],
            centreFinancier: dto["Centre financier"],
            codeCentreFinancier: dto["Centre financier CODE"],
            domaineFonctionnel: dto["Domaine fonctionnel"],
            codeDomaineFonctionnel: dto["Domaine fonctionnel CODE"],
            amount: dto["Montant payé"],
            dateOperation: dto["Date de dernière opération sur la DP"],
            updateDate: new Date(),
        };

        return {
            ...partial,
            // @TODO: remove uniqueId from Chorus #3942
            uniqueId: getMD5(
                `${partial.ej}-${partial.numPosteEJ}-${partial.numeroDemandePaiement}-${partial.numPosteDP}-${partial.codeSociete}-${partial.exercice}`,
            ),
        };
    }

    private static getIdentifier(dto: ChorusFseDto): Siret | Ridet | Tahitiet {
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

    public static toFseEntity(dto: ChorusFseDto): ChorusFseEntity {
        return {
            ej: dto["N° EJ"],
            ejPostNum: dto["N° poste EJ"],
            identifier: this.getIdentifier(dto),
            branch: dto["Branche"],
            branchCode: dto["Branche CODE"],
            programRef: dto["Référentiel de programmation"],
            programRefCode: dto["Référentiel de programmation CODE"],
            paymentRequestNum: dto["N° DP"],
            paymentRequestPostNum: dto["N° poste DP"],
            societyCode: dto["Société"],
            budgetaryYear: Number(dto["Exercice comptable"]),
            paidSupplierId: dto["Fournisseur payé (DP)"],
            beneficiaryName: dto["Désignation de la structure"],
            financialCenter: dto["Centre financier"],
            financialCenterCode: dto["Centre financier CODE"],
            functionalDomain: dto["Domaine fonctionnel"],
            functionalDomainCode: dto["Domaine fonctionnel CODE"],
            amount: dto["Montant payé"],
            operationDate: dto["Date de dernière opération sur la DP"],
            updateDate: new Date(),
        };
    }
}
