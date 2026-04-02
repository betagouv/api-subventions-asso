import type {
    GetAssociationResponseDto,
    GetEstablishmentsResponseDto,
    GetGrantsResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    GetPaymentsFlatResponseDto,
    GetApplicationsFlatResponseDto,
    GetDocumentsResponseDto,
    StructureIdentifierDto,
    AssociationIdentifierDto,
    GetOldGrantsResponseDto,
    GetGrantsSuccessResponseDto,
} from "dto";
import { ApplicationStatus } from "dto";

import { Readable } from "stream";
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
    Example,
} from "tsoa";
import { HttpErrorInterface, NotAssociationError } from "core";

import associationService from "../../../modules/associations/associations.service";
import grantService from "../../../modules/grant/grant.service";
import { JoinedRawGrantDto } from "../../../modules/grant/@types/rawGrant";
import associationIdentifierService from "../../../modules/association-identifier/association-identifier.service";
import grantExtractService from "../../../modules/grant/grantExtract.service";
import { errorHandler } from "../../../middlewares/error.middleware";
import associationHelper from "../../../modules/associations/associations.helper";
import paymentFlatService from "../../../modules/paymentFlat/paymentFlat.service";
import applicationFlatService from "../../../modules/applicationFlat/applicationFlat.service";
import { PAYMENT_DTO_EXAMPLE, APPLICATION_DTO_EXAMPLE } from "./examples/Grants";
import { OLD_APPLICATON_DTO, OLD_PAYMENT_DTO } from "./examples/OldGrants";
import { DOCUMENT_DTO } from "./examples/Documents";

export async function isAssoIdentifierFromAssoMiddleware(req, _res, next) {
    /*
     * middleware that
     * * retrieves normalized identifier from param `identifier` and throws if identifier does not belong
     *   to an association
     * * stores normalized identifier in request as `assoIdentifier`
     * requires that identifier is present in parameter `identifier`
     * */
    try {
        // avoids case sensitivity breaks with identifiers containing letters
        const identifier = (req.params.identifier as string).toUpperCase();
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
@Response<HttpErrorInterface>("401", "Non authentifié", { message: "User not logged", code: 1, cause: {} })
@Response<HttpErrorInterface>("422", "Identifiant invalide", {
    message: "Votre recherche pointe vers une entité qui n'est pas une association",
    code: 0,
    cause: {},
})
export class AssociationHttp extends Controller {
    /**
     * Remonte les informations d'une association.
     * Accepte un RNA (ex: W123456789), un SIREN (ex: 123456789) ou un SIRET (ex:10000000000012.
     * Seul endpoint acceptant le SIRET — les autres endpoints de cette route n'acceptent que RNA ou SIREN.
     *
     * @summary Informations d'une association
     * @param identifier RNA, SIREN ou SIRET de l'association
     * @param req
     */
    @Example<GetAssociationResponseDto>({
        association: {
            siren: [
                {
                    type: "string",
                    value: "10000000000012",
                    provider: "provider-siret",
                    last_update: new Date("2024-01-15"),
                },
            ],
            rna: [
                {
                    type: "string",
                    value: "W751234567",
                    provider: "provider-rna",
                    last_update: new Date("2024-01-15"),
                },
            ],
            denomination_siren: [
                {
                    type: "string",
                    value: "Association Exemple",
                    provider: "provider-siret",
                    last_update: new Date("2024-01-15"),
                },
            ],
            denomination_rna: [
                {
                    type: "string",
                    value: "Association Exemple",
                    provider: "provider-rna",
                    last_update: new Date("2024-01-15"),
                },
            ],
        },
    })
    @Get("/")
    @Response<HttpErrorInterface>("404", "Association introuvable")
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
    @Example<GetSubventionsResponseDto>({
        subventions: [OLD_APPLICATON_DTO],
    })
    @Get("/subventions")
    @Response<HttpErrorInterface>("404", "Association introuvable")
    public async getDemandeSubventions(
        @Path() identifier: AssociationIdentifierDto,
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
    @Example<GetPaymentsResponseDto>({
        versements: [OLD_PAYMENT_DTO],
    })
    @Get("/versements")
    public async getPayments(
        @Path() identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetPaymentsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;

        const payments = await associationService.getPayments(associationIdentifiers);
        return { versements: payments };
    }

    /**
     * Retourne les versements liés à une association au format plat (PaymentFlat).
     *
     * @summary Versements au format plat
     * @param identifier RNA ou SIREN de l'association
     * @param req
     */
    @Example<GetPaymentsFlatResponseDto>({
        paiements: [PAYMENT_DTO_EXAMPLE],
    })
    @Get("/paiements")
    @Response<HttpErrorInterface>("404", "Association introuvable")
    public async getPaymentsFlat(
        @Path() identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetPaymentsFlatResponseDto> {
        const associationIdentifiers = req.assoIdentifier;
        const payments = await paymentFlatService.getPaymentsDto(associationIdentifiers);
        return { paiements: payments };
    }

    /**
     * Retourne les demandes de subventions au format plat (ApplicationFlat).
     *
     * @summary Demandes de subventions au format plat
     * @param identifier RNA ou SIREN de l'association
     * @param req
     */
    @Example<GetApplicationsFlatResponseDto>({
        applications: [APPLICATION_DTO_EXAMPLE],
    })
    @Get("/applications")
    @Response<HttpErrorInterface>("404", "Association introuvable")
    public async getApplicationFlat(
        @Path() identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetApplicationsFlatResponseDto> {
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
    @Example<GetOldGrantsResponseDto>({
        subventions: [
            {
                application: {
                    service_instructeur: {
                        value: "DRAJES Île-de-France",
                        provider: "provider slug",
                        last_update: new Date("2024-01-15"),
                    },
                    siret: {
                        value: 10000000000012,
                        provider: "provider slug",
                        last_update: new Date("2024-01-15"),
                    },
                    statut_label: {
                        value: ApplicationStatus.GRANTED,
                        provider: "provider slug",
                        last_update: new Date("2024-01-15"),
                    },
                    status: {
                        value: "Accordé",
                        provider: "provider slug",
                        last_update: new Date("2024-01-15"),
                    },
                },
                payments: [],
            },
        ],
        count: 1,
    } as unknown as GetOldGrantsResponseDto)
    @Deprecated()
    @Get("/grants")
    public async getOldGrants(
        @Path() identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetOldGrantsResponseDto> {
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
    @Example<GetGrantsSuccessResponseDto>({
        subventions: [{ application: APPLICATION_DTO_EXAMPLE, payments: [PAYMENT_DTO_EXAMPLE] }],
        count: 1,
    })
    @Get("/grants/v2")
    public async getGrants(
        @Path() identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetGrantsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;
        const grants = await grantService.getGrantsDto(associationIdentifiers);
        return { subventions: grants, count: grants.length };
    }

    /**
     * Exporte les subventions d'une association (demandes ET versements) au format CSV.
     * Le nom du fichier est transmis dans l'en-tête Content-Disposition.
     *
     * @summary Export CSV des subventions
     * @param identifier RNA ou SIREN de l'association
     * @param req
     */
    @Get("/grants/csv")
    @Produces("text/csv")
    @Example(
        `Nom de l'association;RNA de l'association;Adresse de l'établissement;Exercice de la demande;Siret;Code postal demandeur;Service instructeur;Dispositif;Intitulé de l'action;Montant demandé;Montant accordé;Statut de la demande;Montant versé;Centre financier du dernier paiement;Date du dernier paiement;Programme des paiements`,
    )
    @Response<HttpErrorInterface>("404", "Association introuvable")
    public async getGrantsExtract(@Path() identifier: AssociationIdentifierDto, @Request() req): Promise<Readable> {
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
    @Deprecated()
    @Get("/raw-grants")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>("404")
    @Response<HttpErrorInterface>("403", "Accès refusé")
    public async getRawGrants(
        @Path() identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<JoinedRawGrantDto[]> {
        const associationIdentifiers = req.assoIdentifier;

        return grantService.getRawGrantsDto(associationIdentifiers);
    }

    /**
     * Recherche les documents liés à une association
     *
     * @summary Recherche les documents liés à une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Example<GetDocumentsResponseDto>({
        documents: [DOCUMENT_DTO],
    })
    @Get("/documents")
    public async getDocuments(
        @Path() identifier: AssociationIdentifierDto,
        @Request() req,
    ): Promise<GetDocumentsResponseDto> {
        const associationIdentifiers = req.assoIdentifier;

        const documents = await associationService.getDocuments(associationIdentifiers);
        return { documents };
    }

    /**
     * Retourne tous les établissements liés à une association
     *
     * @summary Établissements d'une association
     * @param identifier Identifiant Siren ou Rna
     * @param req
     */
    @Example<GetEstablishmentsResponseDto>({
        etablissements: [
            {
                siret: [
                    {
                        type: "string",
                        value: "10000000000012",
                        provider: "Sirene",
                        last_update: new Date("2024-01-15"),
                    },
                ],
                nic: [
                    {
                        type: "string",
                        value: "00012",
                        provider: "Sirene",
                        last_update: new Date("2024-01-15"),
                    },
                ],
                siege: [
                    {
                        type: "boolean",
                        value: true,
                        provider: "Sirene",
                        last_update: new Date("2024-01-15"),
                    },
                ],
                ouvert: [
                    {
                        type: "boolean",
                        value: true,
                        provider: "Sirene",
                        last_update: new Date("2024-01-15"),
                    },
                ],
            },
        ],
    })
    @Get("/etablissements")
    @Response<HttpErrorInterface>("404", "Association introuvable")
    public async getEstablishments(
        @Path() identifier: AssociationIdentifierDto,
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
