import { ProviderDataEntity } from "../../../../@types/ProviderDataEntity";

interface FonjepTiersEntity extends ProviderDataEntity {
    code: string;
    siretOuRidet: string | null;
    raisonSociale: string | null;
    estAssociation: string | null;
    estCoFinanceurPostes: string | null;
    estFinanceurPostes: string | null;
    codePostal: string | null;
    ville: string | null;
    contactEmail: string | null;
}

export default FonjepTiersEntity;
