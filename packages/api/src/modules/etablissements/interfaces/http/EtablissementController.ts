import { DemandeSubvention, Siret, Versement} from '@api-subventions-asso/dto';
import { Route, Get, Controller, Tags, Security } from 'tsoa';
import Document from '../../../documents/@types/Document';
import etablissementService from '../../etablissements.service';

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
    public async getDemandeSubventions(
        siret: Siret,
    ): Promise<{ success: boolean, subventions?: DemandeSubvention[], message?: string}>{
        try {
            const result = await etablissementService.getSubventions(siret);
            return { success: true, subventions: result };
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
    public async getVersements(
        siret: Siret,
    ): Promise<{ success: boolean, versements?: Versement[], message?: string}>{
        try {
            const result = await etablissementService.getVersements(siret);
            return { success: true, versements: result };
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
    public async getDocuments(
        siret: Siret,
    ): Promise<{ success: boolean, documents?: Document[], message?: string}>{
        try {
            const result = await etablissementService.getDocuments(siret);
            return { success: true, documents: result };
        } catch (e: unknown) {
            this.setStatus(404);
            return { success: false, message: (e as Error).message }
        }
    }
}