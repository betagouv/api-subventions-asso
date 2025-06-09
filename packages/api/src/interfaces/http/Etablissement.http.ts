import { Readable } from "stream";
import {
    DemandeSubvention,
    GetDocumentsResponseDto,
    GetEtablissementResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    GetGrantsResponseDto,
    EstablishmentIdentifierDto,
    SiretDto,
} from "dto";
import { Route, Get, Controller, Tags, Security, Response, Produces, Middlewares, Hidden, Request } from "tsoa";
import { NotAssociationError, HttpErrorInterface } from "core";
import etablissementService from "../../modules/etablissements/etablissements.service";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import grantExtractService from "../../modules/grant/grantExtract.service";
import { errorHandler } from "../../middlewares/ErrorMiddleware";
import associationHelper from "../../modules/associations/associations.helper";

export async function isEtabIdentifierFromAssoMiddleware(req, _res, next) {
    /*
     * middleware that
     * * retrieves normalized identifier from param `identifier` and throws if identifier does not belong
     *   to an association
     * * stores normalized establishment identifier in request as `estabIdentifier`
     * requires that identifier is present in parameter `identifier`
     * */
    try {
        const identifier = req.params.identifier;
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);
        if (!(await associationHelper.isIdentifierFromAsso(estabIdentifier.associationIdentifier)))
            throw new NotAssociationError();
        req.estabIdentifier = estabIdentifier;
    } catch (e) {
        // somehow errorMiddleware does not catch errors in tsoa middlewares so it needs ot be called explicitly
        errorHandler(false)(e, req, _res, next);
    }
    next();
}

@Route("etablissement/{identifier}")
@Middlewares(isEtabIdentifierFromAssoMiddleware)
@Security("jwt")
@Tags("Etablissement Controller")
export class EtablissementHttp extends Controller {
    /**
     * Remonte les informations d'un établissement
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Get("/")
    @Response<HttpErrorInterface>("400", "SIRET incorrect", {
        message: "You must provide a valid SIRET",
    })
    @Response<HttpErrorInterface>("404", "L'établissement n'a pas été trouvé", {
        message: "Etablissement not found",
    })
    public async getEtablissement(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetEtablissementResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const etablissement = await etablissementService.getEtablissement(estabIdentifier);
        return { etablissement };
    }

    /**
     *
     * * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements)
     * @param identifier  SIRET de l'établissement
     * @param req
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("grants")
    public async getGrants(identifier: EstablishmentIdentifierDto, @Request() req): Promise<GetGrantsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const grants = await etablissementService.getGrants(estabIdentifier);
        return { subventions: grants };
    }

    /**
     * Recherche les demandes de subventions liées à un établissement
     *
     * @summary Recherche les demandes de subventions liées à un établissement
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Get("subventions")
    public async getDemandeSubventions(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetSubventionsResponseDto> {
        const estabIdentifier = req.estabIdentifier;

        const data = await etablissementService.getSubventions(estabIdentifier).toPromise();
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
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Get("versements")
    public async getPaymentsEstablishement(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetPaymentsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const payments = await etablissementService.getPayments(estabIdentifier);
        return { versements: payments };
    }

    /**
     * Recherche les documents liés à un établissement
     *
     * @summary Recherche les documents liés à un établissement
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Get("documents")
    public async getDocuments(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetDocumentsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const documents = await etablissementService.getDocuments(estabIdentifier);
        return { documents };
    }

    @Get("documents/rib")
    public async getRibs(identifier: EstablishmentIdentifierDto, @Request() req): Promise<GetDocumentsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const ribs = await etablissementService.getRibs(estabIdentifier);
        return { documents: ribs };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     */
    @Hidden()
    @Get("/{identifier}/extract-data")
    public async registerExtract(): Promise<boolean> {
        return true;
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements) et en extrait un fichier csv
     * @param identifier  SIRET de l'établissement
     * @param req
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/grants/csv")
    @Produces("text/csv")
    @Response<string>("200")
    public async getGrantsExtract(identifier: SiretDto, @Request() req): Promise<Readable> {
        const estabIdentifier = req.estabIdentifier;
        const { csv, fileName } = await grantExtractService.buildCsv(estabIdentifier);

        this.setHeader("Content-Type", "text/csv");
        this.setHeader("Content-Disposition", `inline; filename=${fileName}`);
        this.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        const stream = new Readable();
        stream.push(csv);
        stream.push(null);
        return stream;
    }
}
