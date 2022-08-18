import { GetAssociationResponseDto, GetEtablissementResponseDto, GetEtablissementsResponseDto, GetSubventionsResponseDto, GetVersementsResponseDto, GetDocumentsResponseDto, DemandeSubvention } from '@api-subventions-asso/dto';
import { ErrorResponse } from "@api-subventions-asso/dto/shared/ResponseStatus";
import { Route, Get, Controller, Tags, Security, Response } from 'tsoa';
import { AssociationIdentifiers, StructureIdentifiers } from '../../../../@types';

import associationService from "../../associations.service";

@Route("association")
@Security("jwt")
@Tags("Association Controller")
export class AssociationController extends Controller {
    /**
     * Remonte les informations d'une association
     * @param identifier Siret, Siren ou Rna
     */
    @Get("/{identifier}")
    @Response<ErrorResponse>("404")
    public async getAssociation(identifier: StructureIdentifiers): Promise<GetAssociationResponseDto> {
        try {
            const association = await associationService.getAssociation(identifier);
            if (association) return { success: true, association };
            this.setStatus(404);
            return { success: false, message: "Association not found" };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }

    /**
     * Recherche les demandes de subventions liées à une association
     * 
     * @summary Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/subventions")
    @Response<ErrorResponse>("404")
    public async getDemandeSubventions(identifier: AssociationIdentifiers): Promise<GetSubventionsResponseDto> {
        try {
            const flux = await associationService.getSubventions(identifier);
            const result = await flux.toPromise();
            const subventions = result.map(fluxSub => fluxSub.subventions).filter(sub => sub).flat() as DemandeSubvention[];
            return { success: true, subventions };
        } catch (e) {
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
    public async getVersements(identifier: AssociationIdentifiers): Promise<GetVersementsResponseDto> {
        try {
            const result = await associationService.getVersements(identifier);
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
    public async getDocuments(identifier: AssociationIdentifiers): Promise<GetDocumentsResponseDto> {
        try {
            const result = await associationService.getDocuments(identifier);
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
    @Response<ErrorResponse>("400", "Identifiant incorrect", { success: false, message: "You must provide a valid SIREN or RNA" })
    @Response<ErrorResponse>("404", "Pas de correspondance SIREN-RNA", { success: false, message: "We haven't found a corresponding SIREN to the given RNA {identifier}" })
    public async getEtablissement(identifier: AssociationIdentifiers, nic: string): Promise<GetEtablissementResponseDto> {
        const etablissement = await associationService.getEtablissement(identifier, nic);
        return { success: true, etablissement };
    }
}