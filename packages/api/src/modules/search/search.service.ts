import etablissementService from "../etablissements/etablissements.service";
import associationsService from "../associations/associations.service";
import { siretToSiren } from "../../shared/helpers/SirenHelper";

import { Siret, Rna, Siren } from "../../@types";
import demandesSubventionsService from "../demandes_subventions/demandes_subventions.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import versementsService from "../versements/versements.service";

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
            versements: []
        };

        return await versementsService.aggregateVersementsByEtablissementSearch(etablissementDto);
    }

    public async getByRna(rna: Rna) {
        const siren = await rnaSirenService.getSiren(rna);

        if (!siren) {
            const association = await associationsService.getAssociationByRna(rna);

            if (!association) return null;

            return {
                association,
                etablissements: []
            }
        }

        return this.getBySiren(siren, rna);
    }

    public async getBySiren(siren: Siren, rna?: Rna) {
        if (!rna) {
            rna = await rnaSirenService.getRna(siren) || undefined
        }
        const association = await associationsService.getAssociationBySiren(siren, rna);

        if (!association) return null;
        const etablissements = (await etablissementService.getEtablissementsBySiren(siren) || []).sort(e => {
            if (!e.ouvert || !e.ouvert[0].value) return 2;
            if (e.siege && e.siege[0].value) return -1;
            return 1;
        });

        const demandesSubventions = await demandesSubventionsService.getDemandeSubventionsBySiren(siren);

        const associationDto = {
            ...association,
            etablissements: etablissements.map((etablissement) => (
                {
                    ...etablissement,
                    demandes_subventions: demandesSubventions?.filter(d => d.siret.value === etablissement.siret[0].value) || [],
                    versements: [],
                })
            ),
            versements: [],
        }

        return await versementsService.aggregateVersementsByAssoSearch(associationDto);
    }
}

const searchService = new SearchService();

export default searchService;