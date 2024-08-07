import { Controller, Get, Route, Tags } from "tsoa";
import { SiretDto, PublishableGrantDto, AssociationIdentifierDto, StructureIdentifierDto } from "dto";
import openDataGrantService from "../../modules/_open-data/grant/openDataGrantService";

@Route("open-data/subventions")
@Tags("Open Data")
export class GrantHttp extends Controller {
    /**
     * Récupérer les demandes de subventions et versements liés à un établissement identifié par son SIRET
     *
     * @summary Récupérer les demandes de subventions et versements liés à un établissement identifié par son SIRET
     * @param siret le siret de l'établissement
     */
    @Get("/etablissement/{siret}")
    async getOpenDataGrantsByEstablishment(siret: SiretDto): Promise<PublishableGrantDto[]> {
        return await openDataGrantService.getByStructure(siret);
    }

    /**
     * Récupérer les demandes de subventions et versements liés à une association identifiée par son SIREN ou son RNA
     *
     * @summary Récupérer les demandes de subventions et versements liés à une association identifiée par son SIREN ou son RNA
     * @param siren_ou_rna le siren ou le rna de l'association
     */
    @Get("/association/{siren_ou_rna}")
    async getOpenDataGrantsByAssociation(siren_ou_rna: AssociationIdentifierDto): Promise<PublishableGrantDto[]> {
        return await openDataGrantService.getByStructure(siren_ou_rna);
    }

    /**
     * Récupérer les demandes de subventions et versements liés à une association ou à un établissement identifié par son SIREN ou son RNA ou son SIRET
     *
     * @summary Récupérer les demandes de subventions et versements liés à une association ou à un établissement identifié par son SIREN ou son RNA ou son SIRET
     * @param siren_ou_siret_ou_rna le siren ou le siret ou le rna de l'association ou de l'établissement
     */
    @Get("/structure/{siren_ou_siret_ou_rna}")
    async getOpenDataGrantsByStructure(siren_ou_siret_ou_rna: StructureIdentifierDto): Promise<PublishableGrantDto[]> {
        return await openDataGrantService.getByStructure(siren_ou_siret_ou_rna);
    }
}
