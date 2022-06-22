import { DemandeSubvention, GetAssociationResponseDto, GetEtablissementNegativeResponseDto, GetEtablissementResponseDto, GetEtablissementsResponseDto, Versement } from '@api-subventions-asso/dto';
import { Route, Get, Controller, Tags, Security, Response } from 'tsoa';
import { AssociationIdentifiers, StructureIdentifiers } from '../../../../@types';
import Document from '../../../documents/@types/Document';

import associationService from "../../associations.service";

@Route("association")
@Security("jwt")
@Tags("Association Controller")
export class AssociationController extends Controller {
    /**
     * Recherche les demandes de subventions liées à une association
     * 
     * @summary Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/subventions")
    public async getDemandeSubventions(identifier: AssociationIdentifiers): Promise<{success: boolean, message?: string, subventions?: DemandeSubvention[]}> {
        try {
            const result = await associationService.getSubventions(identifier) as DemandeSubvention[];
            return { success: true, subventions: result };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }

    /**
     * Recherche les versements liées à une association
     * 
     * @summary Recherche les versements liées à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/versements")
    public async getVersements(identifier: AssociationIdentifiers): Promise<{success: boolean, message?: string, versements?: Versement[]}> {
        try {
            const result = await associationService.getVersements(identifier) as Versement[];
            return { success: true, versements: result };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }

    /**
     * Recherche les documents liées à une association
     * 
     * @summary Recherche les documents liées à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/documents")
    public async getDocuments(identifier: AssociationIdentifiers): Promise<{success: boolean, message?: string, documents?: Document[]}> {
        try {
            const result = await associationService.getDocuments(identifier) as Document[];
            return { success: true, documents: result };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }

    /**
     * Retourne tous les établisements liée à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/etablissements")
    public async getEtablissements(identifier: AssociationIdentifiers): Promise<GetEtablissementsResponseDto> {
        try {
            const etablissements = await associationService.getEtablissements(identifier);
            return { success: true, etablissements };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }

    /**
     * Remonte les informations d'un établissement liée à l'association
     * @param identifier Identifiant Siren ou Rna
     * @param nic Code nic de l'établissement
     */
    @Get("/{identifier}/etablissement/{nic}")
    @Response<GetEtablissementNegativeResponseDto>("4XX")
    @Response<GetEtablissementNegativeResponseDto>("5XX")
    public async getEtablissement(identifier: AssociationIdentifiers, nic: string): Promise<GetEtablissementResponseDto> {
        const etablissement = await associationService.getEtablissement(identifier, nic);
        return { success: true, etablissement };
    }

    /**
     * Remonte les informations d'une association
     * @param identifier Siret, Siren ou Rna
     */
    @Get("/{identifier}")
    public async getAssociation(identifier: StructureIdentifiers): Promise<GetAssociationResponseDto> {
        try {
            const association = await associationService.getAssociation(identifier);
            if (association) return { success: true, association };
            this.setStatus(404);
            return { success: true, message: "Association not found" };
        } catch (e: unknown) {
            return { success: false, message: (e as Error).message }
        }
    }
}