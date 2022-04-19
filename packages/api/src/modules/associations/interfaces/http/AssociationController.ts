import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { StructureIdentifiers } from '../../../../@types';
import DemandeSubvention from '../../../demandes_subventions/@types/DemandeSubvention';

import associationService from "../../associations.service";

@Route("association")
@Security("jwt")
@Tags("Association Controller")
export class AssociationController extends Controller {
    /**
     * Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siret, Siren ou Rna
     */
     @Get("/{identifier}/subventions")
    public async getDemandeSubventions(identifier: StructureIdentifiers): Promise<{success: boolean, message?: string, subventions?: DemandeSubvention[]}> {
        try {
            const result = await associationService.getSubventions(identifier) as DemandeSubvention[];
            return { success: true, subventions: result };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }
}