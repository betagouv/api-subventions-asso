import { Association, AssociationNature } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import { RnaStructureDto } from "../dto/RnaStructureDto";
import { DDMMYYYYToUTCDate } from "../../../../shared/helpers/DateHelper";
import UseCase from "../../../../@types/use-case/UseCase";

// @TODO: create entities as use case never transform to DTO. It is the adapters that transform entities to DTO.
// Not used yet
export default class TransformRnaStructureToAssoUseCase implements UseCase<RnaStructureDto, Association> {
    execute(structure: RnaStructureDto) {
        const toPVs = ProviderValueFactory.buildProviderValuesMapper(
            "RNA",
            DDMMYYYYToUTCDate(structure.identite.date_modif_rna, "-"),
        );

        // structure.identite.util_publique seems not to be implemented yet
        // a workaround is to use the nature field that can be read to determine if the association is RUP
        if (structure.identite?.nature === "Reconnue d'utilité publique") {
            structure.identite.util_publique = true;
        }

        return {
            rna: toPVs(structure.identite.id_rna),
            denomination_rna: toPVs(structure.identite.nom),
            date_creation_rna: structure.identite.date_pub_jo
                ? toPVs(DDMMYYYYToUTCDate(structure.identite.date_pub_jo, "-"))
                : undefined,
            date_modification_rna: toPVs(DDMMYYYYToUTCDate(structure.identite.date_modif_rna, "-")),
            objet_social: toPVs(structure.activites.objet),
            code_objet_social_1: toPVs(structure.activites.lib_objet_social1),
            adresse_siege_rna: toPVs({
                numero: structure.coordonnees.adresse_siege.num_voie?.toString(),
                type_voie: structure.coordonnees.adresse_siege.type_voie,
                voie: structure.coordonnees.adresse_siege.voie,
                code_postal: structure.coordonnees.adresse_siege.cp?.toString(),
                commune: structure.coordonnees.adresse_siege.commune,
            }),
            nature: toPVs(structure.identite.nature as AssociationNature),
            rup: structure.identite.util_publique ? toPVs(structure.identite.util_publique) : undefined,
            date_rup: structure.identite.date_publication_util_publique
                ? toPVs(structure.identite.date_publication_util_publique)
                : undefined,
        };
    }
}
