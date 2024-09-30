import { Readable } from "stream";
import {
    DemandeSubvention,
    GetDocumentsResponseDto,
    GetEtablissementResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    GetGrantsResponseDto,
    EstablishmentIdentifierDto,
} from "dto";
import { Route, Get, Controller, Tags, Security, Response, Produces } from "tsoa";
import etablissementService from "../../modules/etablissements/etablissements.service";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
import Siret from "../../valueObjects/Siret";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import grantExtractService from "../../modules/grant/grantExtract.service";

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
    public async getEtablissement(siret: EstablishmentIdentifierDto): Promise<GetEtablissementResponseDto> {
        const identifier = await establishmentIdentifierService.getEstablishmentIdentifiers(siret);
        const etablissement = await etablissementService.getEtablissement(identifier);
        return { etablissement };
    }

    /**
     *
     * * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements)
     * @param siret SIRET de l'établissement
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/{siret}/grants")
    public async getGrants(siret: EstablishmentIdentifierDto): Promise<GetGrantsResponseDto> {
        const identifier = await establishmentIdentifierService.getEstablishmentIdentifiers(siret);
        const grants = await etablissementService.getGrants(identifier);
        return { subventions: grants };
    }

    /**
     * Recherche les demandes de subventions liées à un établissement
     *
     * @summary Recherche les demandes de subventions liées à un établissement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/subventions")
    public async getDemandeSubventions(siret: EstablishmentIdentifierDto): Promise<GetSubventionsResponseDto> {
        const identifier = await establishmentIdentifierService.getEstablishmentIdentifiers(siret);

        const data = await etablissementService.getSubventions(identifier).toPromise();
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
    public async getPaymentsEstablishement(siret: EstablishmentIdentifierDto): Promise<GetPaymentsResponseDto> {
        const establishement = await establishmentIdentifierService.getEstablishmentIdentifiers(siret);
        const payments = await etablissementService.getPayments(establishement);
        return { versements: payments };
    }

    /**
     * Recherche les documents liés à un établissement
     *
     * @summary Recherche les documents liés à un établissement
     * @param siret Identifiant Siret
     */
    @Get("/{siret}/documents")
    public async getDocuments(siret: EstablishmentIdentifierDto): Promise<GetDocumentsResponseDto> {
        const identifier = await establishmentIdentifierService.getEstablishmentIdentifiers(siret);
        const documents = await etablissementService.getDocuments(identifier);
        return { documents };
    }

    @Get("/{siret}/documents/rib")
    public async getRibs(siret: EstablishmentIdentifierDto): Promise<GetDocumentsResponseDto> {
        const identifier = await establishmentIdentifierService.getEstablishmentIdentifiers(siret);
        const ribs = await etablissementService.getRibs(identifier);
        return { documents: ribs };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     * @param identifier Identifiant Siret
     * @deprecated
     */
    @Get("/{identifier}/extract-data")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async registerExtract(identifier: EstablishmentIdentifierDto): Promise<boolean> {
        return true;
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements) et en extrait un fichier csv
     * @param identifier SIRET de l'établissement
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/{identifier}/grants/csv")
    @Produces("text/csv")
    @Response<string>("200")
    public async getGrantsExtract(identifier: Siret): Promise<Readable> {
        const { csv, fileName } = await grantExtractService.buildCsv(identifier);

        this.setHeader("Content-Type", "text/csv");
        this.setHeader("Content-Disposition", `inline; filename=${fileName}`);
        const stream = new Readable();
        stream.push(csv);
        stream.push(null);
        return stream;
    }
}
