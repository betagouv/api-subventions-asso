import { Controller, Get, Route, Tags } from "tsoa";
import { SiretDto, PublishableGrantDto, AssociationIdentifierDto, StructureIdentifierDto } from "dto";
import openDataGrantService from "../../modules/_open-data/grant/openDataGrantService";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";
import associationIdentifierService from "../../modules/association-identifier/association-identifier.service";
import Siret from "../../identifierObjects/Siret";

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
        const identifier = await establishmentIdentifierService.getEstablishmentIdentifiers(siret);
        return await openDataGrantService.getByStructure(identifier);
    }

    /**
     * Récupérer les demandes de subventions et versements liés à une association identifiée par son SIREN ou son RNA
     *
     * @summary Récupérer les demandes de subventions et versements liés à une association identifiée par son SIREN ou son RNA
     * @param siren_ou_rna le siren ou le rna de l'association
     */
    @Get("/association/{siren_ou_rna}")
    async getOpenDataGrantsByAssociation(siren_ou_rna: AssociationIdentifierDto): Promise<PublishableGrantDto[]> {
        const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(siren_ou_rna);

        return await openDataGrantService.getByStructure(associationIdentifiers);
    }

    /**
     * Récupérer les demandes de subventions et versements liés à une association ou à un établissement identifié par son SIREN ou son RNA ou son SIRET
     *
     * @summary Récupérer les demandes de subventions et versements liés à une association ou à un établissement identifié par son SIREN ou son RNA ou son SIRET
     * @param siren_ou_siret_ou_rna le siren ou le siret ou le rna de l'association ou de l'établissement
     */
    @Get("/structure/{siren_ou_siret_ou_rna}")
    async getOpenDataGrantsByStructure(siren_ou_siret_ou_rna: StructureIdentifierDto): Promise<PublishableGrantDto[]> {
        const identifier = Siret.isSiret(siren_ou_siret_ou_rna)
            ? await establishmentIdentifierService.getEstablishmentIdentifiers(siren_ou_siret_ou_rna)
            : await associationIdentifierService.getOneAssociationIdentifier(siren_ou_siret_ou_rna);
        return await openDataGrantService.getByStructure(identifier);
    }
}
