import { Controller, Get, Route, Tags } from "tsoa";
import { Siret, PublishableGrantDto } from "@api-subventions-asso/dto";
import openDataGrantService from "../../openDataGrantService";
import { AssociationIdentifiers, StructureIdentifiers } from "../../../../../@types";

@Route("open-data/subventions")
@Tags("Open Data")
export class GrantController extends Controller {
    @Get("/etablissement/{siret}")
    async getOpenDataGrantsByEstablishment(siret: Siret): Promise<PublishableGrantDto[]> {
        return await openDataGrantService.getByStructure(siret);
    }

    @Get("/association/{siren_ou_rna}")
    async getOpenDataGrantsByAssociation(siren_ou_rna: AssociationIdentifiers): Promise<PublishableGrantDto[]> {
        return await openDataGrantService.getByStructure(siren_ou_rna);
    }

    @Get("/structure/{siren_ou_siret_ou_rna}")
    async getOpenDataGrantsByStructure(siren_ou_siret_ou_rna: StructureIdentifiers): Promise<PublishableGrantDto[]> {
        return await openDataGrantService.getByStructure(siren_ou_siret_ou_rna);
    }
}
