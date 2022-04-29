import DemandeSubvention from 'api-subventions-asso-dto/search/DemandeSubventionDto';
import { Route, Get, Controller, Tags, Security } from 'tsoa';
import { Siret } from '../../../../@types';
import etablissementService from '../../etablissements.service';

@Route("etablissement")
@Security("jwt")
@Tags("Etablissement Controller")
export class EtablissementController extends Controller {
    /**
     * Recherche les demandes de subventions liées à un Siret
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
            return { success: false, message: (e as Error).message}
        }
    }
}