import { GetDocumentsResponseDto, GetSubventionsResponseDto, GetVersementsResponseDto, Siret, Versement } from '@api-subventions-asso/dto';
import { Route, Get, Controller, Tags, Security, Response } from 'tsoa';
import { Document } from '@api-subventions-asso/dto/search/Document';
import etablissementService from '../../etablissements.service';
import { ErrorResponse } from "@api-subventions-asso/dto/shared/ResponseStatus";

@Route("etablissement")
@Security("jwt")
@Tags("Etablissement Controller")
export class EtablissementController extends Controller {
    /**
     * Recherche les demandes de subventions liées à un établisement
     * 
     * @summary Recherche les demandes de subventions liées à un établisement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/subventions")
    @Response<ErrorResponse>("404")
    public async getDemandeSubventions(
        siret: Siret,
    ): Promise<GetSubventionsResponseDto> {
        try {
            const subventions = await etablissementService.getSubventions(siret);
            return { success: true, subventions };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }

    /**
     * Recherche les versements liées à un établisement
     * 
     * @summary Recherche les versements liées à un établisement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/versements")
    @Response<ErrorResponse>("404")
    public async getVersements(
        siret: Siret,
    ): Promise<GetVersementsResponseDto> {
        try {
            const versements = await etablissementService.getVersements(siret);
            return { success: true, versements };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }

    /**
 * Recherche les documents liées à un établisement
 * 
 * @summary Recherche les documents liées à un établisement
 * @param siret Identifiant Siret
 */
    @Get("/{siret}/documents")
    @Response<ErrorResponse>("404")
    public async getDocuments(
        siret: Siret,
    ): Promise<GetDocumentsResponseDto> {
        try {
            const documents = await etablissementService.getDocuments(siret);
            return { success: true, documents };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }
}