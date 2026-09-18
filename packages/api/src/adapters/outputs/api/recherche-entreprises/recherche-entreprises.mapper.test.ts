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
                    siret: "12345678900018",
                },
                nombre_etablissements: 3,
            };

            const result = RechercheEntreprisesMapper.toAssociationSearchEntity(dto);

            expect(result).toMatchSnapshot();
        });

        it("should handle cases where complements or siege are missing", () => {
            const dto = {
                nom_complet: "Example Association",
                siren: "123456789",
                complements: null,
                siege: null,
                nombre_etablissements: 2,
            } as unknown as RechercheEntreprisesResultDto & { nom_complet: string; siren: string };

            const expected = {
                name: dto.nom_complet,
                siren: new Siren(dto.siren),
                mainEstablishmentSiret: undefined,
                rna: undefined,
                address: undefined,
                nbEstabs: dto.nombre_etablissements,
            };

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

            const expected = {
                name: dto.nom_complet,
                siren: new Siren(dto.siren),
                rna: undefined,
                address: undefined,
                nbEstabs: dto.nombre_etablissements,
            };

            const result = RechercheEntreprisesMapper.toAssociationSearchEntity(dto);

            expect(result).toEqual(expected);
        });
    });
});
