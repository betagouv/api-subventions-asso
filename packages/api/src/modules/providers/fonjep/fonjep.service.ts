import { ProviderEnum } from "../../../@enums/ProviderEnum";
import FonjepTypePosteDbo from "../../../dataProviders/db/providers/fonjep/dbo/fonjepTypePosteDbo";
import FonjepVersementDbo from "../../../dataProviders/db/providers/fonjep/dbo/FonjepVersementDbo";
import fonjepDispositifPort from "../../../dataProviders/db/providers/fonjep/fonjep.dispositif.port";
import fonjepPostesPort from "../../../dataProviders/db/providers/fonjep/fonjep.postes.port";
import fonjepTiersPort from "../../../dataProviders/db/providers/fonjep/fonjep.tiers.port";
import fonjepTypePostePort from "../../../dataProviders/db/providers/fonjep/fonjep.typePoste.port";
import fonjepVersementsPort from "../../../dataProviders/db/providers/fonjep/fonjep.versements.port";
import ProviderCore from "../ProviderCore";
import FonjepEntityAdapter from "./adapters/FonjepEntityAdapter";
import FonjepDispositifEntity from "./entities/FonjepDispositifEntity";
import FonjepPosteEntity from "./entities/FonjepPosteEntity";
import FonjepTiersEntity from "./entities/FonjepTiersEntity";
import FonjepTypePosteEntity from "./entities/FonjepTypePosteEntity";
import FonjepVersementEntity from "./entities/FonjepVersementEntity";
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

    public fromFileToEntities(filePath: string): {
        tierEntities: FonjepTiersEntity[];
        posteEntities: FonjepPosteEntity[];
        versementEntities: FonjepVersementEntity[];
        typePosteEntities: FonjepTypePosteEntity[];
        dispositifEntities: FonjepDispositifEntity[];
    } {
        const { tiers, postes, versements, typePoste, dispositifs } = FonjepParser.parse(filePath);

        const tierEntities = tiers.map(tier => FonjepEntityAdapter.toFonjepTierEntity(tier));

        const posteEntities = postes.map(poste => FonjepEntityAdapter.toFonjepPosteEntity(poste));

        const versementEntities = versements.map(versement => FonjepEntityAdapter.toFonjepVersementEntity(versement));

        const typePosteEntities = typePoste.map(typePoste => FonjepEntityAdapter.toFonjepTypePosteEntity(typePoste));

        const dispositifEntities = dispositifs.map(dispositif =>
            FonjepEntityAdapter.toFonjepDispositifEntity(dispositif),
        );

        return { tierEntities, posteEntities, versementEntities, typePosteEntities, dispositifEntities };
    }

    /**
     * |----------------------------|
     * |  Database Management      |
     * |----------------------------|
     */

    useTemporyCollection(active: boolean) {
        fonjepDispositifPort.useTemporyCollection(active);
        fonjepPostesPort.useTemporyCollection(active);
        fonjepTiersPort.useTemporyCollection(active);
        fonjepTypePostePort.useTemporyCollection(active);
        fonjepVersementsPort.useTemporyCollection(active);
    }

    async createFonjepCollections(
        tierEntities: FonjepTiersEntity[],
        posteEntities: FonjepPosteEntity[],
        versementEntities: FonjepVersementEntity[],
        typePosteEntities: FonjepTypePosteEntity[],
        dispositifEntities: FonjepDispositifEntity[],
    ) {
        await fonjepTiersPort.insertMany(tierEntities);
        await fonjepPostesPort.insertMany(posteEntities);
        await fonjepVersementsPort.insertMany(versementEntities);
        await fonjepTypePostePort.insertMany(typePosteEntities);
        await fonjepDispositifPort.insertMany(dispositifEntities);
    }

    async applyTemporyCollection() {
        await fonjepDispositifPort.applyTemporyCollection();
        await fonjepPostesPort.applyTemporyCollection();
        await fonjepTiersPort.applyTemporyCollection();
        await fonjepTypePostePort.applyTemporyCollection();
        await fonjepVersementsPort.applyTemporyCollection();
    }
}

const fonjepService = new FonjepService();
export default fonjepService;
