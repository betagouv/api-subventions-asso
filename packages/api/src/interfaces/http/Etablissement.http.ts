import {
    DemandeSubvention,
    GetDocumentsResponseDto,
    GetEtablissementResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    Siret,
    GetGrantsResponseDto,
} from "dto";
import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import etablissementService from "../../modules/etablissements/etablissements.service";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";

@Route("etablissement")
@Security("jwt")
@Tags("Etablissement Controller")
export class EtablissementHttp extends Controller {
    /**
     * Remonte les informations d'un établissement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}")
    @Response<HttpErrorInterface>("400", "SIRET incorrect", {
        message: "You must provide a valid SIRET",
    })
    @Response<HttpErrorInterface>("404", "L'établissement n'a pas été trouvé", {
        message: "Etablissement not found",
    })
    public async getEtablissement(siret: Siret): Promise<GetEtablissementResponseDto> {
        const etablissement = await etablissementService.getEtablissement(siret);
        return { etablissement };
    }

    /**
     *
     * * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements)
     * @param siret SIRET de l'établissement
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/{siret}/grants")
    public async getGrants(siret: Siret): Promise<GetGrantsResponseDto> {
        const grants = await etablissementService.getGrants(siret);
        return { subventions: grants };
    }

    /**
     * Recherche les demandes de subventions liées à un établissement
     *
     * @summary Recherche les demandes de subventions liées à un établissement
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
     * Recherche les payments liés à un établissement
     *
     * @summary Recherche les payments liés à un établissement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/versements")
    public async getPayments(siret: Siret): Promise<GetPaymentsResponseDto> {
        const payments = await etablissementService.getPayments(siret);
        return { versements: payments };
    }

    /**
     * Recherche les documents liés à un établissement
     *
     * @summary Recherche les documents liés à un établissement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/documents")
    public async getDocuments(siret: Siret): Promise<GetDocumentsResponseDto> {
        const documents = await etablissementService.getDocuments(siret);
        return { documents };
    }

    @Get("/{siret}/documents/rib")
    public async getRibs(siret: Siret): Promise<GetDocumentsResponseDto> {
        const ribs = await etablissementService.getRibs(siret);
        return { documents: ribs };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     * @param identifier Identifiant Siret
     * @deprecated
     */
    @Get("/{identifier}/extract-data")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async registerExtract(identifier: Siret): Promise<boolean> {
        return true;
    }
}
