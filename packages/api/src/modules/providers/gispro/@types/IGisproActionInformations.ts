import { Siret } from "@api-subventions-asso/dto";

export default interface IGisproActionInformations {
    siret: Siret;
    tier: string;
    codeTier: string;
    typeTier: string;
    montant: number;
    codeRequest: string;
    action: string;
    codeAction: string;
    direction: string;
    pnOrOs: string;
    importedDate: Date;
}
