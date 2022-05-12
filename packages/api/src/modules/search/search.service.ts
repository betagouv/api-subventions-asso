import etablissementService from "../etablissements/etablissements.service";
import associationsService from "../associations/associations.service";

import { Siret, Rna, Siren ,DemandeSubvention, Etablissement } from "@api-subventions-asso/dto";
import demandesSubventionsService from "../demandes_subventions/demandes_subventions.service";
import rnaSirenService from "../open-data/rna-siren/rnaSiren.service";
import versementsService from "../versements/versements.service";
import associationNameService from "../association-name/associationName.service"
export class SearchService {

    public async getBySiret(siret: Siret) {
        const etablissement = await etablissementService.getEtablissement(siret);
        if (!etablissement) return null;

        const association = await associationsService.getAssociationBySiret(siret)
        if (!association) return null;

        let demandes_subventions: DemandeSubvention[] = [];

        try {
            demandes_subventions = await demandesSubventionsService.getByEtablissement(siret);
        } catch (e) {
            if (e instanceof Error && e.message != "Establishment not found") {
                throw e;
            }
        }        

        const etablissementDto =  {
            ...etablissement,
            association,
            demandes_subventions: demandes_subventions,
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
        if (!rna) rna = await rnaSirenService.getRna(siren) || undefined;

        const association = await associationsService.getAssociationBySiren(siren, rna);
        if (!association) return null;

        const etablissements = await etablissementService.getEtablissementsBySiren(siren);
        if (!etablissements) return null;

        const sortEtablissmentsByStatus = (etablisementA: Etablissement, etablisementB: Etablissement) => this.scoreEtablisement(etablisementB) - this.scoreEtablisement(etablisementA);
        
        const sortedEtablissments = etablissements.sort(sortEtablissmentsByStatus); // The order is the "siege", the secondary is open, the secondary is closed.
        let demandesSubventions: DemandeSubvention[] = []
        try {
            demandesSubventions = await demandesSubventionsService.getByAssociation(siren);
        } catch (e) {
            if (e instanceof Error && e.message != "Association not found") {
                throw e;
            }
        }

        const buildCompletEtablissement = (etablissement: Etablissement) => ({
            ...etablissement,
            demandes_subventions: demandesSubventions?.filter(d => d.siret.value === etablissement.siret[0].value) || [],
            versements: [],
        })

        const associationDto = {
            ...association,
            etablissements: sortedEtablissments.map(buildCompletEtablissement),
            versements: [],
        }

        return await versementsService.aggregateVersementsByAssoSearch(associationDto);
    }
    
    public async getAssociationsKeys(value: string) {
        return await associationNameService.getAllStartingWith(value);
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