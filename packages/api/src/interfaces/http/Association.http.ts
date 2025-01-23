import { Readable } from "stream";
import {
    GetAssociationResponseDto,
    GetEtablissementsResponseDto,
    GetGrantsResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    GetDocumentsResponseDto,
    DemandeSubvention,
    StructureIdentifierDto,
    AssociationIdentifierDto,
} from "dto";
import { Route, Get, Controller, Tags, Security, Response, Produces, Middlewares, Path, Request } from "tsoa";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";

import associationService from "../../modules/associations/associations.service";
import grantService from "../../modules/grant/grant.service";
import { JoinedRawGrant } from "../../modules/grant/@types/rawGrant";
import associationIdentifierService from "../../modules/association-identifier/association-identifier.service";
import grantExtractService from "../../modules/grant/grantExtract.service";
import { BadRequestError } from "../../shared/errors/httpErrors";
import { errorHandler } from "../../middlewares/ErrorMiddleware";

async function isAssoIdentifierFromAssoMiddleware(req, _res, next) {
    try {
        const identifier = req.params.identifier;
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);
        if (!(await associationService.isIdentifierFromAsso(associationIdentifiers)))
            throw new BadRequestError("L'identifiant n'appartient pas à une association");
        req.assoIdentifier = associationIdentifiers;
    } catch (e) {
        errorHandler(false)(e, req, _res, next);
    }
    next();
}

@Route("association")
@Security("jwt")
@Tags("Association Controller")
export class AssociationHttp extends Controller {
    async getIdentifier(req, strIdentifier: string) {
        return req.assoIdentifier ?? (await associationIdentifierService.getOneAssociationIdentifier(strIdentifier));
    }

    /**
     * Remonte les informations d'une association
     * @param identifier Siret, Siren ou Rna
     * @param req
     */
    @Get("/{identifier}")
    @Middlewares(isAssoIdentifierFromAssoMiddleware)
    @Response<HttpErrorInterface>("404")
    public async getAssociation(
        @Path() identifier: StructureIdentifierDto,
        @Request() req,
    ): Promise<GetAssociationResponseDto> {
        const associationIdentifiers = await this.getIdentifier(req, identifier);

        const association = await associationService.getAssociation(associationIdentifiers);
        return { association };
    }

    /**
     * Recherche les demandes de subventions liées à une association
     *
     * @summary Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/subventions")
    @Response<HttpErrorInterface>("404")
    public async getDemandeSubventions(identifier: AssociationIdentifierDto): Promise<GetSubventionsResponseDto> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);
        const flux = await associationService.getSubventions(associationIdentifiers);

        if (!flux) return { subventions: null };
        const result = await flux.toPromise();
        const subventions = result
            .map(fluxSub => fluxSub.subventions)
            .filter(sub => sub)
            .flat() as DemandeSubvention[];
        return { subventions };
    }

    /**
     * Recherche les payments liés à une association
     *
     * @summary Recherche les payments liés à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/versements")
    public async getPayments(identifier: AssociationIdentifierDto): Promise<GetPaymentsResponseDto> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);

        const payments = await associationService.getPayments(associationIdentifiers);
        return { versements: payments };
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'une association (demandes ET versements)
     * @param identifier RNA ou SIREN de l'association
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/{identifier}/grants")
    public async getGrants(identifier: AssociationIdentifierDto): Promise<GetGrantsResponseDto> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);
        const grants = await grantService.getGrants(associationIdentifiers);
        return { subventions: grants };
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'une association (demandes ET versements) et en extrait un fichier csv
     * @param identifier RNA ou SIREN de l'association
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/{identifier}/grants/csv")
    @Produces("text/csv")
    @Response<string>("200")
    public async getGrantsExtract(identifier: AssociationIdentifierDto): Promise<Readable> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);

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
     */
    @Get("/{identifier}/raw-grants")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>("404")
    public async getRawGrants(identifier: AssociationIdentifierDto): Promise<JoinedRawGrant[]> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);

        return grantService.getRawGrants(associationIdentifiers);
    }

    /**
     * Recherche les documents liés à une association
     *
     * @summary Recherche les documents liés à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/documents")
    public async getDocuments(identifier: AssociationIdentifierDto): Promise<GetDocumentsResponseDto> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);

        const documents = await associationService.getDocuments(associationIdentifiers);
        return { documents };
    }

    /**
     * Retourne tous les établissements liés à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/etablissements")
    public async getEstablishments(identifier: AssociationIdentifierDto): Promise<GetEtablissementsResponseDto> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(identifier);

        const etablissements = await associationService.getEstablishments(associationIdentifiers);
        return { etablissements };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     * @param identifier Identifiant Siren ou Rna
     * @deprecated
     */
    @Get("/{identifier}/extract-data")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async registerExtract(identifier: AssociationIdentifierDto): Promise<boolean> {
        return true;
    }
}
