import AssociationSearchEntity from "../../../../entities/AssociationSearchEntity";
import Rna from "../../../../identifier-objects/Rna";
import Siren from "../../../../identifier-objects/Siren";
import { RechercheEntreprisesMapper } from "./recherche-entreprises.mapper";
import { RechercheEntreprisesResultDto } from "./@types/RechercheEntreprisesDto";

describe("RechercheEntreprisesAdapter", () => {
    describe("toAssociationSearchEntity", () => {
        it("should convert RechercheEntreprisesResultDto to AssociationSearchEntity", () => {
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

            const expected = new AssociationSearchEntity({
                name: dto.nom_complet,
                siren: new Siren(dto.siren),
                rna: new Rna(dto.complements?.identifiant_association),
                address: {
                    number: dto.siege.numero_voie,
                    type: dto.siege.type_voie,
                    name: dto.siege.libelle_voie,
                    postalCode: dto.siege.code_postal,
                    city: dto.siege.libelle_commune,
                    complement: null,
                },
                nbEstabs: dto.nombre_etablissements,
            });

            const result = RechercheEntreprisesMapper.toAssociationSearchEntity(dto);

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

            const expected = new AssociationSearchEntity({
                name: dto.nom_complet,
                siren: new Siren(dto.siren),
                rna: undefined,
                address: undefined,
                nbEstabs: dto.nombre_etablissements,
            });

            const result = RechercheEntreprisesMapper.toAssociationSearchEntity(dto);

            expect(result).toEqual(expected);
        });

        it("should handle cases where complements or siege fields are missing", () => {
            const dto = {
                nom_complet: "Example Association",
                siren: "123456789",
                complements: { other_field: "value" },
                nombre_etablissements: 1,
            } as unknown as RechercheEntreprisesResultDto & { nom_complet: string; siren: string };

            const expected = new AssociationSearchEntity({
                name: dto.nom_complet,
                siren: new Siren(dto.siren),
                rna: undefined,
                address: undefined,
                nbEstabs: dto.nombre_etablissements,
            });

            const result = RechercheEntreprisesMapper.toAssociationSearchEntity(dto);

            expect(result).toEqual(expected);
        });
    });
});
