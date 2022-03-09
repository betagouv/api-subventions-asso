import etablissementService from "../etablissements/etablissements.service";
import associationsService from "../associations/associations.service";
import { siretToSiren } from "../../shared/helpers/SirenHelper";

import { Siret } from "../../@types/Siret";
import { Rna } from "../../@types/Rna";
import demandesSubventionsService from "../demandes_subventions/demandes_subventions.service";
import Etablissement from "../etablissements/interfaces/Etablissement";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import versementsService from "../versements/versements.service";
import { Siren } from "../../@types/Siren";

export class SearchService {

    public async getBySiret(siret: Siret) {
        const siren = siretToSiren(siret);

        const association = await associationsService.getAssociationBySiren(siren)

        if (!association || !association.etablisements_siret?.find(providerValue => providerValue.value.includes(siret))) return null;

        const etablissement = await etablissementService.getEtablissement(siret);
        if (!etablissement) return null;

        const etablissementDto =  {
            ...etablissement,
            association,
            demandes_subventions: await demandesSubventionsService.getDemandeSubventionsBySiret(siret),
        };

        return await versementsService.aggregateVersementsByEtablissementSearch(etablissementDto);
    }

    public async getByRna(rna: Rna) {
        const siren = await rnaSirenService.getSiren(rna);

        if (!siren) return null;

        return this.getBySiren(siren, rna);
    }

    public async getBySiren(siren: Siren, rna ?: Rna) {

        if (!rna) {
            rna = await rnaSirenService.getRna(siren) || undefined
        }

        const association = await associationsService.getAssociationBySiren(siren, rna);

        if (!association) return null;

        const sirets = (association.etablisements_siret || [])
            .map(value => value.value)
            .flat();

        const etablissements = (await Promise.all(
            [...new Set(sirets)].map(siret => etablissementService.getEtablissement(siret))
        )).filter(e => e) as Etablissement[];

        const associationDto = {
            ...association,
            etablissements: await Promise.all(
                etablissements.map(async (etablissement) => ({
                    ...etablissement,
                    demandes_subventions: await demandesSubventionsService.getDemandeSubventionsBySiret(etablissement.siret[0].value)
                }))
            )
        }

        return await versementsService.aggregateVersementsByAssoSearch(associationDto);
    }
}

const searchService = new SearchService();

export default searchService;