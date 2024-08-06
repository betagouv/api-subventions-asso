import DEFAULT_ASSOCIATION from "../../../__fixtures__/association.fixture";
import ChorusLineEntity from "../../../../src/modules/providers/chorus/entities/ChorusLineEntity";

export const ChorusFixtures: ChorusLineEntity[] = [
    {
        uniqueId: "de175292263fdd97b222a754309df07f",
        indexedInformations: {
            ej: "0001821732",
            siret: DEFAULT_ASSOCIATION.siret,
            codeBranche: "Z039",
            branche: "Associations",
            activitee: "Appels a projet",
            codeActivitee: "3222",
            numeroDemandePayment: "000195567",
            companyCode: "9765",
            exercise: 2023,
            numeroTier: "ASSO 1",
            centreFinancier: "UO DGER XXXX-C001",
            codeCentreFinancier: "AA01/0776-C001-4000",
            domaineFonctionnel: "Appels à projet",
            codeDomaineFonctionnel: "0101-01-02",
            amount: 89988.3,
            dateOperation: new Date("2023-07-12T00:00:00.000Z"),
        },
        data: {
            "N° EJ": "0001821732",
            "Fournisseur payé (DP) CODE": "1000011111",
            "Fournisseur payé (DP)": DEFAULT_ASSOCIATION.name,
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": DEFAULT_ASSOCIATION.siret,
            "Référentiel de programmation CODE": "BG00/077601000201",
            "Référentiel de programmation": "Appels a projet",
            "N° DP": "000195567",
            companyCode: "975",
            exercise: 2023,
            "Date de dernière opération sur la DP": "12/07/2023",
            "Centre financier CODE": "AA01/0776-C001-4000",
            "Centre financier": "UO DGER XXXX-C001",
            "Domaine fonctionnel CODE": "0101-01-02",
            "Domaine fonctionnel": "Appels à projet",
            "Montant payé": 89988.3,
        },
        provider: "Chorus",
    },
    {
        uniqueId: "11d177d88edbd421e4eef4f2e8d42b28",
        indexedInformations: {
            ej: "0001821732",
            siret: DEFAULT_ASSOCIATION.siret,
            codeBranche: "Z039",
            branche: "Associations",
            activitee: "Appels a projet",
            codeActivitee: "3222",
            numeroDemandePayment: "000212692",
            companyCode: "9765",
            exercise: 2023,
            numeroTier: "ASSO 2",
            centreFinancier: "UO DGER",
            codeCentreFinancier: "AA01/0776-C001-4000",
            domaineFonctionnel: "Domaine fonctionnel 0102",
            codeDomaineFonctionnel: "0102-C001",
            amount: 89931.9,
            dateOperation: new Date("2023-04-21T00:00:00.000Z"),
        },
        data: {
            "N° EJ": "0002822326",
            "Fournisseur payé (DP) CODE": "2000002222",
            "Fournisseur payé (DP)": DEFAULT_ASSOCIATION.name,
            "Branche CODE": "Z039",
            Branche: "Associations",
            "Code taxe 1": DEFAULT_ASSOCIATION.siret,
            "Référentiel de programmation CODE": "BG00/077601000201",
            "Référentiel de programmation": "Appels a projet",
            "N° DP": "000212692",
            "Date de dernière opération sur la DP": "21/04/2023",
            "Centre financier CODE": "AA01/0776-C001-4000",
            "Centre financier": "UO DGER",
            "Domaine fonctionnel CODE": "0102-C001",
            "Domaine fonctionnel": "Domaine fonctionnel 0102",
            "Montant payé": 89931.9,
        },
        provider: "Chorus",
    },
];
