import AssociationNameEntity from "../../../modules/association-name/entities/AssociationNameEntity";
import Rna from "../../../valueObjects/Rna";
import Siren from "../../../valueObjects/Siren";
import { RechercheEntreprisesAdapter } from "./RechercheEntreprisesAdapter";
import { RechercheEntreprisesResultDto } from "./RechercheEntreprisesDto";

describe("RechercheEntreprisesAdapter", () => {
    describe("toAssociationNameEntity", () => {
        it("should convert RechercheEntreprisesResultDto to AssociationNameEntity", () => {
            const dto = {
                nom_complet: "Example Association",
                siren: "123456789",
                complements: { identifiant_association: "W123456789" },
                siege: {
                    numero_voie: "123",
                    type_voie: "Rue",
                    libelle_voie: "Example Street",
                    code_postal: "12345",
                    libelle_commune: "Example City",
                },
                nombre_etablissements: 3,
            };

            const expected = new AssociationNameEntity(
                dto.nom_complet,
                new Siren(dto.siren),
                new Rna(dto.complements?.identifiant_association),
                {
                    numero: dto.siege.numero_voie,
                    type_voie: dto.siege.type_voie,
                    voie: dto.siege.libelle_voie,
                    code_postal: dto.siege.code_postal,
                    commune: dto.siege.libelle_commune,
                },
                dto.nombre_etablissements,
            );

            const result = RechercheEntreprisesAdapter.toAssociationNameEntity(dto);

            expect(result).toEqual(expected);
        });

        it("should handle cases where complements or siege are missing", () => {
            const dto = {
                nom_complet: "Example Association",
                siren: "123456789",
                complements: null,
                siege: null,
                nombre_etablissements: 2,
            } as unknown as RechercheEntreprisesResultDto & { nom_complet: string; siren: string };

            const expected = new AssociationNameEntity(
                dto.nom_complet,
                new Siren(dto.siren),
                undefined,
                undefined,
                dto.nombre_etablissements,
            );

            const result = RechercheEntreprisesAdapter.toAssociationNameEntity(dto);

            expect(result).toEqual(expected);
        });

        it("should handle cases where complements or siege fields are missing", () => {
            const dto = {
                nom_complet: "Example Association",
                siren: "123456789",
                complements: { other_field: "value" },
                nombre_etablissements: 1,
            } as unknown as RechercheEntreprisesResultDto & { nom_complet: string; siren: string };

            const expected = new AssociationNameEntity(
                dto.nom_complet,
                new Siren(dto.siren),
                undefined,
                undefined,
                dto.nombre_etablissements,
            );

            const result = RechercheEntreprisesAdapter.toAssociationNameEntity(dto);

            expect(result).toEqual(expected);
        });
    });
});
