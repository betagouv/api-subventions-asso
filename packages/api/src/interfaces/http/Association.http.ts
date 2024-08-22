import { Readable } from "stream";
import {
    GetAssociationResponseDto,
    GetEtablissementsResponseDto,
    GetGrantsResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    GetDocumentsResponseDto,
    DemandeSubvention,
} from "dto";
import { Route, Get, Controller, Tags, Security, Response, Produces } from "tsoa";
import { AssociationIdentifiers, StructureIdentifiers } from "../../@types";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";

import associationService from "../../modules/associations/associations.service";
import grantService from "../../modules/grant/grant.service";
import { JoinedRawGrant } from "../../modules/grant/@types/rawGrant";
import grantExtractService from "../../modules/grant/grantExtract.service";

@Route("association")
@Security("jwt")
@Tags("Association Controller")
export class AssociationHttp extends Controller {
    /**
     * Remonte les informations d'une association
     * @param identifier Siret, Siren ou Rna
     */
    @Get("/{identifier}")
    @Response<HttpErrorInterface>("404")
    public async getAssociation(identifier: StructureIdentifiers): Promise<GetAssociationResponseDto> {
        const association = await associationService.getAssociation(identifier);
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
    public async getDemandeSubventions(identifier: AssociationIdentifiers): Promise<GetSubventionsResponseDto> {
        const flux = await associationService.getSubventions(identifier);

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
    public async getPayments(identifier: AssociationIdentifiers): Promise<GetPaymentsResponseDto> {
        const payments = await associationService.getPayments(identifier);
        return { versements: payments };
    }

    /**
     *
     * @summary Recherche toutes les informations des subventions d'une association (demandes ET versements)
     * @param identifier RNA ou SIREN de l'association
     * @returns Un tableau de subventions avec leur versements, de subventions sans versements et de versements sans subventions
     */
    @Get("/{identifier}/grants")
    public async getGrants(identifier: AssociationIdentifiers): Promise<GetGrantsResponseDto> {
        const grants = await grantService.getGrants(identifier);
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
    public async getGrantsExtract(identifier: AssociationIdentifiers): Promise<Readable> {
        const grants = await grantService.getGrants(identifier);
        const csv = grantExtractService.buildCsv(grants);

        this.setHeader("Content-Type", "text/csv");
        this.setHeader("Content-Disposition", `inline; filename=${identifier}.csv`);

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
    public getRawGrants(identifier: AssociationIdentifiers): Promise<JoinedRawGrant[]> {
        return grantService.getRawGrantsByAssociation(identifier);
    }

    /**
     * Recherche les documents liés à une association
     *
     * @summary Recherche les documents liés à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/documents")
    public async getDocuments(identifier: AssociationIdentifiers): Promise<GetDocumentsResponseDto> {
        const result = await associationService.getDocuments(identifier);
        return { documents: result };
    }

    /**
     * Retourne tous les établissements liés à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/etablissements")
    public async getEstablishments(identifier: AssociationIdentifiers): Promise<GetEtablissementsResponseDto> {
        const etablissements = await associationService.getEstablishments(identifier);
        return { etablissements };
    }

    /**
     * Permet de logger le mail de l'utilisateur qui fait un extract
     * @param identifier Identifiant Siren ou Rna
     * @deprecated
     */
    @Get("/{identifier}/extract-data")
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async registerExtract(identifier: AssociationIdentifiers): Promise<boolean> {
        return true;
    }
}
