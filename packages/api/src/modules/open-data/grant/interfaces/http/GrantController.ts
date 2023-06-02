import { Controller, Get, Route, Tags } from "tsoa";
import { Siret } from "@api-subventions-asso/dto";
import openDataGrantService from "../../openDataGrantService";
import { AssociationIdentifiers, StructureIdentifiers } from "../../../../../@types";

@Route("open-data/grants")
@Tags("Open Data")
export class GrantController extends Controller {
    @Get("/establishment/{siret}")
    async getOpenDataGrantsByEstablishment(siret: Siret) {
        return await openDataGrantService.getByStructure(siret);
    }

    @Get("/association/{identifier}")
    async getOpenDataGrantsByAssociation(identifier: AssociationIdentifiers) {
        return await openDataGrantService.getByStructure(identifier);
    }

    @Get("/structure/{identifier}")
    async getOpenDataGrantsByStructure(identifier: StructureIdentifiers) {
        return await openDataGrantService.getByStructure(identifier);
    }
}
