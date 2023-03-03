import {
    GetAssociationResponseDto,
    GetEtablissementsResponseDto,
    GetSubventionsResponseDto,
    GetVersementsResponseDto,
    GetDocumentsResponseDto,
    DemandeSubvention,
    ErrorResponse
} from "@api-subventions-asso/dto";
import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import { AssociationIdentifiers, StructureIdentifiers } from "../../../../@types";

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
        const association = await associationService.getAssociation(identifier);
        return { association };
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
        const flux = await associationService.getSubventions(identifier);
        const result = await flux.toPromise();
        const subventions = result
            .map(fluxSub => fluxSub.subventions)
            .filter(sub => sub)
            .flat() as DemandeSubvention[];
        return { subventions };
    }

    /**
     * Recherche les versements liées à une association
     *
     * @summary Recherche les versements liées à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/versements")
    public async getVersements(identifier: AssociationIdentifiers): Promise<GetVersementsResponseDto> {
        const result = await associationService.getVersements(identifier);
        return { versements: result };
    }

    /**
     * Recherche les documents liés à une association
     *
     * @summary Recherche les documents liés à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/documents")
    public async getDocuments(identifier: AssociationIdentifiers): Promise<GetDocumentsResponseDto> {
        const result = await associationService.getDocuments(identifier);
        return { documents: result };
    }

    /**
     * Retourne tous les établissements liés à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/etablissements")
    public async getEtablissements(identifier: AssociationIdentifiers): Promise<GetEtablissementsResponseDto> {
        try {
            const etablissements = await associationService.getEtablissements(identifier);
            return { etablissements };
        } catch (e: unknown) {
            this.setStatus(404);
            return { message: (e as Error).message };
        }
    }
}
