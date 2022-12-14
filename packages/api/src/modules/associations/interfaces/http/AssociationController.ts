import {
    GetAssociationResponseDto,
    GetEtablissementsResponseDto,
    GetSubventionsResponseDto,
    GetVersementsResponseDto,
    GetDocumentsResponseDto,
    DemandeSubvention
} from "@api-subventions-asso/dto";
import { ErrorResponse } from "@api-subventions-asso/dto/shared/ResponseStatus";
import { Route, Get, Controller, Tags, Security, Response, Request } from "tsoa";
import { AssociationIdentifiers, IdentifiedRequest, StructureIdentifiers } from "../../../../@types";

import associationService from "../../associations.service";

@Route("association")
@Security("jwt")
@Tags("Association Controller")
export class AssociationController extends Controller {
    /**
     * Remonte les informations d'une association
     * @param req
     * @param identifier Siret, Siren ou Rna
     */
    @Get("/{identifier}")
    @Response<ErrorResponse>("404")
    public async getAssociation(
        @Request() req: IdentifiedRequest,
        identifier: StructureIdentifiers
    ): Promise<GetAssociationResponseDto> {
        try {
            const association = await associationService.getAssociation(identifier);
            if (association) {
                if (!req?.user?.roles?.includes("admin")) await associationService.registerRequest(association);
                return { success: true, association };
            }
            this.setStatus(404);
            return { success: false, message: "Association not found" };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message };
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
            const subventions = result
                .map(fluxSub => fluxSub.subventions)
                .filter(sub => sub)
                .flat() as DemandeSubvention[];
            return { success: true, subventions };
        } catch (e) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message };
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
            return { success: false, message: (e as Error).message };
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
            return { success: false, message: (e as Error).message };
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
            return { success: false, message: (e as Error).message };
        }
    }
}
