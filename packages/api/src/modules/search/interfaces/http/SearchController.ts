import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { Rna, Siren, Siret, Association, Etablissement } from '@api-subventions-asso/dto';
import { isRna, isSiren } from '../../../../shared/Validators';
import AssociationNameEntity from '../../../association-name/entities/AssociationNameEntity';

import searchService from "../../search.service";

@Route("search")
@Security("jwt")
@Tags("Search Controller")
export class SearchController extends Controller {
    /**
     * Recherche des demandes de subventions via le siret de l'établissment
     * @param siret Identifiant Siret
     */
    @Get("/etablissement/{siret}")
    public async findBySiret(
        siret: Siret,
    ): Promise<{ success: boolean, etablissement?: Etablissement, message?: string}>{
        const result = await searchService.getBySiret(siret) as Etablissement;
        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Etablissement not found"}
        } else {
            return { success: true, etablissement: result };
        }
    }

    /**
     * Recherche des demandes de subventions via le rna de l'association
     * @param rna_or_siren Identifiant RNA ou Identifiant Siren
     */
    @Get("/association/{id}")
    public async findAssociation(
        id: Rna | Siren,
    ): Promise<{ success: boolean, association?: Association, message?: string}> {
        let result: Association | null = null;
        if (isRna(id)) {
            result = await searchService.getByRna(id) as Association;
        } else if (isSiren(id)){
            result = await searchService.getBySiren(id) as Association;
        }

        if (!result) {
            this.setStatus(404);
            return { success: false, message: "Association not found"}
        }

        return { success: true, association: result };
    }

    /**
     * Recherche des associations via le rna, siren ou nom partiel ou complet de l'association
     * @param rna_or_siren Identifiant RNA ou Identifiant Siren
     */
    @Get("/associations/{input}")
    public async findAssociations(input: string): Promise<{ success: boolean, result?: AssociationNameEntity[], message?: string }> {
        const result = await searchService.getAssociationsKeys(input);
        if (!result || (Array.isArray(result) && result.length == 0)) {
            this.setStatus(404);
            return { success: false, message: `Could match any association with given input : ${input}`}
        }
        this.setStatus(200);
        return { success: true, result };
    }
}
