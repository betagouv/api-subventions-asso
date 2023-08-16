import iconv from "iconv-lite";
import { Association } from "dto";
import ProviderValueAdapter from "../../../../shared/adapters/ProviderValueAdapter";
import { siretToSiren } from "../../../../shared/helpers/SirenHelper";
import AssociationDto from "../dto/AssociationDto";

export default class AssociationDtoAdapter {
    static PROVIDER_NAME = "<Base RNA> EntrepriseData <https://entreprise.data.gouv.fr>";

    static toAssociation(data: AssociationDto): Association {
        // QUICK FIX TO ENCODE win1252 to utf8
        const TITLE = data.association.titre;
        const ENCODED_TITLE = iconv.decode(Buffer.from(TITLE.toLowerCase(), "binary"), "win1252").toUpperCase();

        return {
            rna: ProviderValueAdapter.toProviderValues(
                data.association.id_association,
                AssociationDtoAdapter.PROVIDER_NAME,
                new Date(data.association.updated_at),
            ),
            siren: data.association.siret
                ? ProviderValueAdapter.toProviderValues(
                      siretToSiren(data.association.siret),
                      AssociationDtoAdapter.PROVIDER_NAME,
                      new Date(data.association.updated_at),
                  )
                : undefined,
            date_creation_rna: ProviderValueAdapter.toProviderValues(
                new Date(data.association.date_creation),
                AssociationDtoAdapter.PROVIDER_NAME,
                new Date(data.association.updated_at),
            ),
            denomination_rna: ProviderValueAdapter.toProviderValues(
                ENCODED_TITLE,
                AssociationDtoAdapter.PROVIDER_NAME,
                new Date(data.association.updated_at),
            ),
            adresse_siege_rna: ProviderValueAdapter.toProviderValues(
                {
                    numero: data.association.adresse_numero_voie,
                    type_voie: data.association.adresse_type_voie,
                    voie: data.association.adresse_libelle_voie,
                    code_postal: data.association.adresse_code_postal,
                    commune: data.association.adresse_libelle_commune,
                },
                AssociationDtoAdapter.PROVIDER_NAME,
                new Date(data.association.updated_at),
            ),
            objet_social: ProviderValueAdapter.toProviderValues(
                data.association.objet,
                AssociationDtoAdapter.PROVIDER_NAME,
                new Date(data.association.updated_at),
            ),
            code_objet_social_1: ProviderValueAdapter.toProviderValues(
                data.association.objet_social1,
                AssociationDtoAdapter.PROVIDER_NAME,
                new Date(data.association.updated_at),
            ),
            code_objet_social_2: ProviderValueAdapter.toProviderValues(
                data.association.objet_social2,
                AssociationDtoAdapter.PROVIDER_NAME,
                new Date(data.association.updated_at),
            ),
        };
    }
}
