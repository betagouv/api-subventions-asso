import AssociationDto from '@api-subventions-asso/dto/search/AssociationDto';
import DemandeSubvention from '@api-subventions-asso/dto/search/DemandeSubventionDto';
import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { StructureIdentifiers } from '../../../../@types';

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

      /**
     * Remonte les informations d'une association
     * @param identifier Siret, Siren ou Rna
     */
      @Get("/{identifier}")
     public async getAssociation(identifier: StructureIdentifiers): Promise<{success: boolean, message?: string, association?: AssociationDto}> {
         try {
             const result = await associationService.getAssociation(identifier);
             if (!result) return { success: true, association: undefined, message: "Association not found" };
             return { success: true, association: result };
         } catch (e: unknown) {
             return { success: false, message: (e as Error).message }
         }
     }
}