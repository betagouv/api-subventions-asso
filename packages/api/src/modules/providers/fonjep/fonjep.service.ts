import { ProviderEnum } from "../../../@enums/ProviderEnum";
import ProviderCore from "../ProviderCore";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import FonjepParser from "./fonjep.parser";

export class FonjepService extends ProviderCore {
    constructor() {
        super({
            name: "Extranet FONJEP",
            type: ProviderEnum.raw,
            description:
                "L'extranet de gestion du Fonjep permet aux services instructeurs d'indiquer les décisions d'attribution des subventions Fonjep et aux associations bénéficiaires de transmettre les informations nécessaires à la mise en paiment des subventions par le Fonjep, il ne gère pas les demandes de subvention qui ne sont pas dématérialisées à ce jour.",
            id: "fonjep",
        });
    }

    public fromFileToEntities(filePath: string) {
        const { tiers, postes, versements, typePoste, dispositifs } = FonjepParser.parse(filePath);

        const tierEntities = tiers.map(tier => {
            FonjepEntityAdapter.toFonjepTierEntity(tier);
        });

        const posteEntities = postes.map(poste => {
            FonjepEntityAdapter.toFonjepPosteEntity(poste);
        });

        const versementEntities = versements.map(versement => {
            FonjepEntityAdapter.toFonjepVersementEntity(versement);
        });

        const typePosteEntities = typePoste.map(typePoste => {
            FonjepEntityAdapter.toFonjepTypePosteEntity(typePoste);
        });

        const dispositifEntities = dispositifs.map(dispositif => {
            FonjepEntityAdapter.toFonjepDispositifEntity(dispositif);
        });

        return { tierEntities, posteEntities, versementEntities, typePosteEntities, dispositifEntities };
    }

    /**
     * |----------------------------|
     * |  Database Management      |
     * |----------------------------|
     */

    useTemporyCollection(active: boolean) {
        // TO DO GIULIA : créate une porte for each entity
        fonjepSubventionPort.useTemporyCollection(active);
        fonjepPaymentPort.useTemporyCollection(active);
    }

    async applyTemporyCollection() {
        await fonjepSubventionPort.applyTemporyCollection();
        await fonjepPaymentPort.applyTemporyCollection();
    }
}

const fonjepService = new FonjepService();
export default fonjepService;
