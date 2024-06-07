import {
    GetAssociationResponseDto,
    GetEtablissementsResponseDto,
    GetSubventionsResponseDto,
    GetPaymentsResponseDto,
    GetDocumentsResponseDto,
    DemandeSubvention,
} from "dto";
import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import { AssociationIdentifiers, StructureIdentifiers } from "../../@types";
import { HttpErrorInterface } from "../../shared/errors/httpErrors/HttpError";

import associationService from "../../modules/associations/associations.service";
import grantService from "../../modules/grant/grant.service";
import { JoinedRawGrant } from "../../modules/grant/@types/rawGrant";

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
     * Recherche les subventions liées à une association, format brut
     *
     * @deprecated test purposes
     * @summary Recherche les subventions liées à une association, format brut
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/{identifier}/grants")
    @Security("jwt", ["admin"])
    @Response<HttpErrorInterface>("404")
    public getGrants(identifier: AssociationIdentifiers): Promise<JoinedRawGrant[]> {
        return grantService.getGrantsByAssociation(identifier);
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
    public async getEtablissements(identifier: AssociationIdentifiers): Promise<GetEtablissementsResponseDto> {
        const etablissements = await associationService.getEtablissements(identifier);
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
