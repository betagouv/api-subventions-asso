import { EstablishmentIdentifier } from "../../../../../identifier-objects";
import ChorusFseEntity from "../../../../../domain/providers/chorus/ChorusFseEntity";
import { ChorusFseDbo } from "./chorus.dbo";

export function toEntity(dbo: ChorusFseDbo): ChorusFseEntity {
    const identifierStr = dbo.siret === "#" ? dbo.ridetOrTahitiet : dbo.siret;
    const identifier = EstablishmentIdentifier.buildIdentifierFromString(identifierStr)!; // can't be null as it is checked in the import pipeline

    return {
        ej: dbo.ej as "#",
        ejPostNum: dbo.numPosteEJ,
        identifier,
        branch: dbo.branche,
        branchCode: dbo.codeBranche,
        programRef: dbo.activitee,
        programRefCode: dbo.codeActivitee,
        paymentRequestNum: dbo.numeroDemandePaiement,
        paymentRequestPostNum: Number(dbo.numPosteDP),
        societyCode: dbo.codeSociete,
        budgetaryYear: Number(dbo.exercice),
        paidSupplierId: dbo.numeroTier,
        beneficiaryName: dbo.nomStructure,
        financialCenter: dbo.centreFinancier,
        financialCenterCode: dbo.codeCentreFinancier,
        functionalDomain: dbo.domaineFonctionnel,
        functionalDomainCode: dbo.codeDomaineFonctionnel,
        amount: dbo.montant,
        operationDate: dbo.dateOperation,
        updateDate: dbo.updateDate,
    };
}
