import etablissementService from "../etablissements/etablissements.service";
import associationsService from "../associations/associations.service";

import { Siret, Rna, Siren } from "@api-subventions-asso/dto";
import demandesSubventionsService from "../demandes_subventions/demandes_subventions.service";
import rnaSirenService from "../rna-siren/rnaSiren.service";
import versementsService from "../versements/versements.service";
import Etablissement from "../etablissements/interfaces/Etablissement";

export class SearchService {

    public async getBySiret(siret: Siret) {
        const etablissement = await etablissementService.getEtablissement(siret);
        if (!etablissement) return null;

        const association = await associationsService.getAssociationBySiret(siret)
        if (!association) return null;

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
        const etablissements = (await etablissementService.getEtablissementsBySiren(siren) || []).sort((etablisementA,etablisementB) => this.scoreEtablisement(etablisementB) - this.scoreEtablisement(etablisementA));

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

    private scoreEtablisement(etablisement: Etablissement) {
        let score = 0;

        if (etablisement.ouvert && etablisement.ouvert[0].value) score += 1;
        if (etablisement.siege && etablisement.siege[0].value) score += 10;
        return score
    }
}

const searchService = new SearchService();

export default searchService;