import { Siret } from "../../../../@types";

export default interface IGisproActionInformations {
    siret: Siret,
    tier: string,
    codeTier: string,
    typeTier: string,
    montant: number,
    codeRequest: string,
    action: string,
    codeAction: string,
    direction: string,
    pnOrOs: string,
}