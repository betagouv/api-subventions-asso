import {
    DemandeSubvention,
    GetDocumentsResponseDto,
    GetEtablissementResponseDto,
    GetSubventionsResponseDto,
    GetVersementsResponseDto,
    Siret,
    ErrorResponse
} from "@api-subventions-asso/dto";
import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import etablissementService from "../../etablissements.service";
import { NotFoundError } from "../../../../shared/errors/httpErrors/NotFoundError";

@Route("etablissement")
@Security("jwt")
@Tags("Etablissement Controller")
export class EtablissementController extends Controller {
    /**
     * Remonte les informations d'un établissement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}")
    @Response<ErrorResponse>("400", "SIRET incorrect", {
        message: "You must provide a valid SIRET"
    })
    @Response<ErrorResponse>("404", "L'établissement n'a pas été trouvé", {
        message: "Etablissement not found"
    })
    public async getEtablissement(siret: Siret): Promise<GetEtablissementResponseDto> {
        const etablissement = await etablissementService.getEtablissement(siret);
        return { etablissement };
    }

    /**
     * Recherche les demandes de subventions liées à un établisement
     *
     * @summary Recherche les demandes de subventions liées à un établisement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/subventions")
    public async getDemandeSubventions(siret: Siret): Promise<GetSubventionsResponseDto> {
        const data = await etablissementService.getSubventions(siret).toPromise();
        const subventions = data
            .map(subFlux => subFlux.subventions)
            .flat()
            .filter(subvention => subvention) as DemandeSubvention[];
        return { subventions };
    }

    /**
     * Recherche les versements liées à un établisement
     *
     * @summary Recherche les versements liées à un établisement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/versements")
    public async getVersements(siret: Siret): Promise<GetVersementsResponseDto> {
        const versements = await etablissementService.getVersements(siret);
        return { versements };
    }

    /**
     * Recherche les documents liées à un établisement
     *
     * @summary Recherche les documents liées à un établisement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/documents")
    public async getDocuments(siret: Siret): Promise<GetDocumentsResponseDto> {
        const documents = await etablissementService.getDocuments(siret);
        return { documents };
    }
}
