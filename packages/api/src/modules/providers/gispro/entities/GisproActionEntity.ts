import { ObjectId } from "mongodb";
import { DefaultObject, ParserInfo, ParserPath } from "../../../../@types";
import IGisproActionInformations from "../@types/IGisproActionInformations";

export default class GisproActionEntity {
    public static indexedProviderInformationsPath: DefaultObject<ParserPath | ParserInfo> = {
        siret: ["tier", "siret"],
        tier: ["tier", "Tiers"],
        codeTier: ["tier", "CodeTiers"],
        typeTier: ["tier", "TypeTiers"],
        montant: ["action", "MT"],
        codeRequest: ["action", "ProjetCodeDossier"],
        action: ["action", "Action"],
        codeAction: ["action", "Action - Code dossier"],
        direction: ["action", "DR/DD/PN"],
        pnOrOs: ["action", "PN/OS"],
        ligneBudgetaire: ["action", "Ligne budgétaire"],
        importedDate: ["generated", "importedDate"]
    };

    public provider = "Gispro";

    constructor(public providerInformations: IGisproActionInformations, public data: unknown, public _id?: ObjectId) {}
}
