import ChorusDbo, { ChorusFseDbo } from "../../../../outputs/db/providers/chorus/chorus.dbo";
import { ChorusDto, ChorusFseDto } from "./chorus.dto";

export class ChorusMapper {
    public static toDbo(dto: ChorusDto): ChorusDbo {
        return {
            ej: dto["N° EJ"],
            numPosteEJ: Number(dto["N° poste EJ"]),
            siret: dto["Code taxe 1"],
            ridetOrTahitiet: dto["No TVA 3 (COM-RIDET ou TAHITI)"],
            codeBranche: dto["Branche CODE"],
            branche: dto["Branche"],
            activitee: dto["Référentiel de programmation"],
            codeActivitee: dto["Référentiel de programmation CODE"],
            numeroDemandePaiement: dto["N° DP"],
            numPosteDP: Number(dto["N° poste DP"]),
            codeSociete: dto["Société"],
            exercice: Number(dto["Exercice comptable"]),
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
    }

    public static toFseDbo(dto: ChorusFseDto): ChorusFseDbo {
        return {
            ej: dto["N° EJ"],
            numPosteEJ: dto["N° poste EJ"],
            siret: dto["Code taxe 1"],
            ridetOrTahitiet: dto["No TVA 3 (COM-RIDET ou TAHITI)"],
            codeBranche: dto["Branche CODE"],
            branche: dto["Branche"],
            activitee: dto["Référentiel de programmation"],
            codeActivitee: dto["Référentiel de programmation CODE"],
            numeroDemandePaiement: dto["N° DP"],
            numPosteDP: Number(dto["N° poste DP"]),
            codeSociete: dto["Société"],
            exercice: Number(dto["Exercice comptable"]),
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
    }
}
