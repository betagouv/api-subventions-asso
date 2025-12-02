import { Readable } from "stream";
import {
    GetAssociationResponseDto,
    GetEstablishmentsResponseDto,
    GetGrantsResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    GetDocumentsResponseDto,
    StructureIdentifierDto,
    AssociationIdentifierDto,
    ApplicationFlatDto,
    PaymentFlatDto,
    GetOldGrantsResponseDto,
} from "dto";
import {
    Route,
    Get,
    Controller,
    Tags,
    Security,
    Response,
    Produces,
    Middlewares,
    Path,
    Request,
    Hidden,
    Deprecated,
} from "tsoa";
import { HttpErrorInterface, NotAssociationError } from "core";

import associationService from "../../modules/associations/associations.service";
import grantService from "../../modules/grant/grant.service";
import { JoinedRawGrant } from "../../modules/grant/@types/rawGrant";
import associationIdentifierService from "../../modules/association-identifier/association-identifier.service";
import grantExtractService from "../../modules/grant/grantExtract.service";
import { errorHandler } from "../../middlewares/ErrorMiddleware";
import associationHelper from "../../modules/associations/associations.helper";
import paymentFlatService from "../../modules/paymentFlat/paymentFlat.service";
import applicationFlatService from "../../modules/applicationFlat/applicationFlat.service";

export async function isAssoIdentifierFromAssoMiddleware(req, _res, next) {
    /*
     * middleware that
     * * retrieves normalized identifier from param `identifier` and throws if identifier does not belong
     *   to an association
     * * stores normalized identifier in request as `assoIdentifier`
     * requires that identifier is present in parameter `identifier`
     * */
    try {
        const identifier = req.params.identifier;
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);
        if (!(await associationHelper.isIdentifierFromAsso(associationIdentifiers))) throw new NotAssociationError();
        req.assoIdentifier = associationIdentifiers;
    } catch (e) {
        // somehow errorMiddleware does not catch errors in tsoa middlewares so it needs ot be called explicitly
        errorHandler(false)(e, req, _res, next);
    }
    next();
}

@Route("association/{identifier}")
@Middlewares(isAssoIdentifierFromAssoMiddleware)
@Security("jwt")
@Tags("Association Controller")
export class AssociationHttp extends Controller {
    /**
     * Remonte les informations d'une association
     * @param identifier Siret, Siren ou Rna
     * @param req
     */
    @Get("/")
    @Response<HttpErrorInterface>("404")
    public async getAssociation(
        @Path() identifier: StructureIdentifierDto,
        @Request() req,
    ): Promise<GetAssociationResponseDto> {
        const associationIdentifiers = req.assoIdentifier;

        const association = await associationService.getAssociation(associationIdentifiers);
        return { association };
    }

    /**
     * Recherche les demandes de subventions liées à une association
     *
     * @summary Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Get("/subventions")
    @Response<HttpErrorInterface>("404")
    public async getDemandeSubventions(
        identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetSubventionsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;
        const subventions = await associationService.getSubventions(associationIdentifiers);
        return { subventions };
    }

    /**
     * Recherche les payments liés à une association
     *
     * @summary Recherche les payments liés à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Get("/versements")
    public async getPayments(identifier: AssociationIdentifierDto, @Request() req): Promise<GetPaymentsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;

        const payments = await associationService.getPayments(associationIdentifiers);
        return { versements: payments };
    }

    /**
     * Recherche les versements liés à une association, au format paymentFlat
     *
     * @summary Recherche les payments liés à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Get("/paiements")
    public async getPaymentsFlat(
        identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<{ paiements: PaymentFlatDto[] }> {
        const associationIdentifiers = req.assoIdentifier;
        const payments = await paymentFlatService.getPaymentsDto(associationIdentifiers);
        return { paiements: payments };
    }

    /**
     * Recherche les demandes de subventions liées à une association
     *
     * @summary Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Get("/applications")
    @Response<HttpErrorInterface>("404")
    public async getApplicationFlat(
        identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<{ applications: ApplicationFlatDto[] }> {
        const associationIdentifiers = req.assoIdentifier;
        const applications = await applicationFlatService.getApplicationsDto(associationIdentifiers);
        return { applications };
    }

    /**
     * @summary Recherche toutes les informations des subventions d'une association (demandes ET versements)
     * @param identifier RNA ou SIREN de l'association
     * @param req
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Deprecated()
    @Get("/grants")
    public async getOldGrants(identifier: AssociationIdentifierDto, @Request() req): Promise<GetOldGrantsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;
        const grants = await grantService.getOldGrants(associationIdentifiers);
        return { subventions: grants, count: grants.length };
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'une association (demandes ET versements)
     * @param identifier RNA ou SIREN de l'association
     * @param req
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/grants/v2")
    public async getGrants(identifier: AssociationIdentifierDto, @Request() req): Promise<GetGrantsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;
        const grants = await grantService.getGrantsDto(associationIdentifiers);
        return { subventions: grants, count: grants.length };
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'une association (demandes ET versements) et en extrait un fichier csv
     * @param identifier RNA ou SIREN de l'association
     * @param req
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/grants/csv")
    @Produces("text/csv")
    @Response<string>("200")
    public async getGrantsExtract(identifier: AssociationIdentifierDto, @Request() req): Promise<Readable> {
        const associationIdentifiers = req.assoIdentifier;

        const { csv, fileName } = await grantExtractService.buildCsv(associationIdentifiers);
        this.setHeader("Content-Type", "text/csv");
        this.setHeader("Content-Disposition", `inline; filename=${fileName}`);
        this.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
        const stream = new Readable();
        stream.push(csv);
        stream.push(null);
        return stream;
    }

    /**
     * Recherche les subventions liées à une association, format brut
     *
     * @deprecated test purposes
     * @summary Recherche les subventions liées à une association, format brut
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Get("/raw-grants")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>("404")
    public async getRawGrants(identifier: AssociationIdentifierDto, @Request() req): Promise<JoinedRawGrant[]> {
        const associationIdentifiers = req.assoIdentifier;

        return grantService.getRawGrants(associationIdentifiers);
    }

    /**
     * Recherche les documents liés à une association
     *
     * @summary Recherche les documents liés à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Get("/documents")
    public async getDocuments(identifier: AssociationIdentifierDto, @Request() req): Promise<GetDocumentsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;

        const documents = await associationService.getDocuments(associationIdentifiers);
        return { documents };
    }

    /**
     * Retourne tous les établissements liés à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Get("/etablissements")
    public async getEstablishments(
        identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetEstablishmentsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;

        const establishments = await associationService.getEstablishments(associationIdentifiers);
        return { etablissements: establishments };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     */
    @Hidden()
    @Get("/extract-data")
    public async registerExtract(): Promise<boolean> {
        return true;
    }
}
