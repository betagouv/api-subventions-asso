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
import { Route, Get, Controller, Tags, Security, Response, Produces, Middlewares, Hidden } from "tsoa";
import etablissementService from "../../modules/etablissements/etablissements.service";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import grantExtractService from "../../modules/grant/grantExtract.service";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { errorHandler } from "../../middlewares/ErrorMiddleware";
import associationService from "../../modules/associations/associations.service";

async function isEtabIdentifierFromAssoMiddleware(req, _res, next) {
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
        if (!(await associationService.isIdentifierFromAsso(estabIdentifier.associationIdentifier)))
            throw new BadRequestError("L'identifiant n'appartient pas à une association");
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
     */
    @Get("/")
    @Response<HttpErrorInterface>("400", "SIRET incorrect", {
        message: "You must provide a valid SIRET",
    })
    @Response<HttpErrorInterface>("404", "L'établissement n'a pas été trouvé", {
        message: "Etablissement not found",
    })
    public async getEtablissement(identifier: EstablishmentIdentifierDto): Promise<GetEtablissementResponseDto> {
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);
        const etablissement = await etablissementService.getEtablissement(estabIdentifier);
        return { etablissement };
    }

    /**
     *
     * * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements)
     * @param identifier  SIRET de l'établissement
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("grants")
    public async getGrants(identifier: EstablishmentIdentifierDto): Promise<GetGrantsResponseDto> {
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);
        const grants = await etablissementService.getGrants(estabIdentifier);
        return { subventions: grants };
    }

    /**
     * Recherche les demandes de subventions liées à un établissement
     *
     * @summary Recherche les demandes de subventions liées à un établissement
     * @param identifier  Identifiant Siret
     */
    @Get("subventions")
    public async getDemandeSubventions(identifier: EstablishmentIdentifierDto): Promise<GetSubventionsResponseDto> {
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);

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
     */
    @Get("versements")
    public async getPaymentsEstablishement(identifier: EstablishmentIdentifierDto): Promise<GetPaymentsResponseDto> {
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);
        const payments = await etablissementService.getPayments(estabIdentifier);
        return { versements: payments };
    }

    /**
     * Recherche les documents liés à un établissement
     *
     * @summary Recherche les documents liés à un établissement
     * @param identifier  Identifiant Siret
     */
    @Get("documents")
    public async getDocuments(identifier: EstablishmentIdentifierDto): Promise<GetDocumentsResponseDto> {
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);
        const documents = await etablissementService.getDocuments(estabIdentifier);
        return { documents };
    }

    @Get("documents/rib")
    public async getRibs(identifier: EstablishmentIdentifierDto): Promise<GetDocumentsResponseDto> {
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);
        const ribs = await etablissementService.getRibs(estabIdentifier);
        return { documents: ribs };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     * @deprecated
     */
    @Hidden()
    @Get("/{identifier}/extract-data")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async registerExtract(): Promise<boolean> {
        return true;
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements) et en extrait un fichier csv
     * @param identifier  SIRET de l'établissement
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/grants/csv")
    @Produces("text/csv")
    @Response<string>("200")
    public async getGrantsExtract(identifier: SiretDto): Promise<Readable> {
        const estabIdentifier = await establishmentIdentifierService.getEstablishmentIdentifiers(identifier);
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
