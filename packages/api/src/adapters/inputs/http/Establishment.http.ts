import {
    type GetDocumentsResponseDto,
    type GetEstablishmentResponseDto,
    type GetSubventionsResponseDto,
    type GetPaymentsResponseDto,
    type EstablishmentIdentifierDto,
    type SiretDto,
    type PaymentFlatDto,
    type ApplicationFlatDto,
    type GetOldGrantsResponseDto,
    type GetGrantsResponseDto,
    ApplicationStatus,
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
    Hidden,
    Request,
    Deprecated,
    Example,
} from "tsoa";
import { Readable } from "stream";
import { NotAssociationError, HttpErrorInterface } from "core";
import establishmentService from "../../../modules/establishments/establishment.service";
import establishmentIdentifierService from "../../../modules/establishment-identifier/establishment-identifier.service";
import grantExtractService from "../../../modules/grant/grantExtract.service";
import { errorHandler } from "../../../middlewares/ErrorMiddleware";
import associationHelper from "../../../modules/associations/associations.helper";
import paymentFlatService from "../../../modules/paymentFlat/paymentFlat.service";
import applicationFlatService from "../../../modules/applicationFlat/applicationFlat.service";
import grantService from "../../../modules/grant/grant.service";
import { APPLICATION_DTO_EXAMPLE, PAYMENT_DTO_EXAMPLE } from "./examples/Grants";
import { OLD_APPLICATON_DTO, OLD_PAYMENT_DTO } from "./examples/OldGrants";
import { DOCUMENT_DTO, DOCUMENT_RIB_DTO } from "./examples/Documents";

export async function isEstabIdentifierFromAssoMiddleware(req, _res, next) {
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
@Middlewares(isEstabIdentifierFromAssoMiddleware)
@Security("jwt")
@Tags("Establishment Controller")
export class EstablishmentHttp extends Controller {
    /**
     * Remonte les informations d'un établissement
     *
     * @summary Informations d'un établissement
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Example<GetEstablishmentResponseDto>({
        etablissement: {
            siret: [
                {
                    type: "string",
                    value: "12345678900012",
                    provider: "Sirene",
                    last_update: new Date("2024-01-15"),
                },
            ],
            nic: [{ type: "string", value: "00012", provider: "Sirene", last_update: new Date("2024-01-15") }],
            siege: [{ type: "boolean", value: true, provider: "Sirene", last_update: new Date("2024-01-15") }],
            ouvert: [{ type: "boolean", value: true, provider: "Sirene", last_update: new Date("2024-01-15") }],
        },
    })
    @Get("/")
    @Response<HttpErrorInterface>("400", "SIRET incorrect", {
        message: "You must provide a valid SIRET",
    })
    @Response<HttpErrorInterface>("404", "L'établissement n'a pas été trouvé", {
        message: "Establishment not found",
    })
    public async getEstablishment(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetEstablishmentResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const establishment = await establishmentService.getEstablishment(estabIdentifier);
        return { etablissement: establishment };
    }

    /**
     * @summary Recherche toutes les informations des subventions d'un établissement (demandes ET versements)
     * @param identifier  SIRET de l'établissement
     * @param req
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Example<GetOldGrantsResponseDto>({
        subventions: [
            {
                application: {
                    service_instructeur: {
                        type: "string",
                        value: "DRAJES Île-de-France",
                        provider: "LeCompteAsso",
                        last_update: new Date("2024-01-15"),
                    },
                    siret: {
                        type: "string",
                        value: "12345678900012",
                        provider: "LeCompteAsso",
                        last_update: new Date("2024-01-15"),
                    },
                    statut_label: {
                        type: "string",
                        value: ApplicationStatus.GRANTED,
                        provider: "LeCompteAsso",
                        last_update: new Date("2024-01-15"),
                    },
                    status: {
                        type: "string",
                        value: "Accordé",
                        provider: "LeCompteAsso",
                        last_update: new Date("2024-01-15"),
                    },
                },
                payments: [],
            },
        ],
        count: 1,
    })
    @Deprecated()
    @Get("grants")
    public async getOldGrants(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetOldGrantsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const grants = await establishmentService.getOldGrants(estabIdentifier);
        return {
            subventions: grants,
            count: grants.length,
        };
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'une association (demandes ET versements)
     * @param identifier RNA ou SIREN de l'association
     * @param req
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Example<GetGrantsResponseDto>({
        subventions: [{ application: APPLICATION_DTO_EXAMPLE, payments: [PAYMENT_DTO_EXAMPLE] }],
        count: 1,
    })
    @Get("/grants/v2")
    public async getGrants(identifier: EstablishmentIdentifierDto, @Request() req): Promise<GetGrantsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const grants = await grantService.getGrantsDto(estabIdentifier);
        return { subventions: grants, count: grants.length };
    }

    /**
     * Recherche les demandes de subventions liées à un établissement
     *
     * @summary Recherche les demandes de subventions liées à un établissement
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Example<GetSubventionsResponseDto>({
        subventions: [OLD_APPLICATON_DTO],
    })
    @Get("subventions")
    public async getDemandeSubventions(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetSubventionsResponseDto> {
        const estabIdentifier = req.estabIdentifier;

        const subventions = await establishmentService.getSubventions(estabIdentifier);
        return { subventions };
    }

    /**
     * Recherche les payments liés à un établissement
     *
     * @summary Recherche les payments liés à un établissement
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Example<GetPaymentsResponseDto>({
        versements: [OLD_PAYMENT_DTO],
    })
    @Get("versements")
    public async getPaymentsEstablishement(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetPaymentsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const payments = await establishmentService.getPayments(estabIdentifier);
        return { versements: payments };
    }

    /**
     * Recherche les versements liés à un établissement, au format paymentFlat
     *
     * @summary Recherche les payments liés à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Example<PaymentFlatDto[]>([PAYMENT_DTO_EXAMPLE])
    @Get("/paiements")
    public async getEntitiesByIdentifier(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<PaymentFlatDto[]> {
        const associationIdentifiers = req.assoIdentifier;
        return paymentFlatService.getPaymentsDto(associationIdentifiers);
    }

    /**
     * Recherche les demandes de subventions liées à un établissement
     *
     * @summary Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Example<ApplicationFlatDto[]>([APPLICATION_DTO_EXAMPLE])
    @Get("/applications")
    @Response<HttpErrorInterface>("404")
    public async getApplicationFlat(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<ApplicationFlatDto[]> {
        const associationIdentifiers = req.assoIdentifier;
        return applicationFlatService.getApplicationsDto(associationIdentifiers);
    }

    /**
     * Recherche les documents liés à un établissement
     *
     * @summary Recherche les documents liés à un établissement
     * @param identifier  Identifiant Siret
     * @param req
     */
    @Example<GetDocumentsResponseDto>({
        documents: [DOCUMENT_DTO],
    })
    @Get("documents")
    public async getDocuments(
        identifier: EstablishmentIdentifierDto,
        @Request() req,
    ): Promise<GetDocumentsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const documents = await establishmentService.getDocuments(estabIdentifier);
        return { documents };
    }

    /**
     * @summary RIBs d'un établissement
     * @param identifier Identifiant Siret
     * @param req
     */
    @Example<GetDocumentsResponseDto>({
        documents: [DOCUMENT_RIB_DTO],
    })
    @Get("documents/rib")
    public async getRibs(identifier: EstablishmentIdentifierDto, @Request() req): Promise<GetDocumentsResponseDto> {
        const estabIdentifier = req.estabIdentifier;
        const ribs = await establishmentService.getRibs(estabIdentifier);
        return { documents: ribs };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     */
    @Hidden()
    @Get("/extract-data")
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
