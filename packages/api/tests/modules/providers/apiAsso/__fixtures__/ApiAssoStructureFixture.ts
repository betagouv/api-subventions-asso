import StructureDto, { StructureEtablissementDto, StructureRepresentantLegalDto, StructureRibDto } from "../../../../../src/modules/providers/apiAsso/dto/StructureDto"

export const fixtureEtablissements = [
    {
        id_siret: "50922194100000",
        adresse: {},
    },
    {
        id_siret: "50922194100001",
        adresse: {},
    }
] as StructureEtablissementDto[]

export const fixtureRib = [{
    id_siret: "50922194100000",
    iban: "TEST",
    bic: "BIC_TEST"
}] as StructureRibDto[];

export const fixtureRepresentantLegal = [{
    nom: "Jedusor",
    prenom: "Tom",
    role: "Mage pas simpa",
    id_siret: "50922194100000"
}] as unknown as StructureRepresentantLegalDto[]

export const fixtureAsso = {
    identite: {
        nom: "TEST",
        nom_sirene: "TEST SIREN 2",
        id_rna: "W00000000",
        id_siren: "509221941",
        id_siret_siege: "5092219410000",
        id_forme_juridique: "9220",
        date_modif_rna: "01-01-2022",
        date_modif_siren: "01-01-2022",
        regime: "Autre"
    },
    activites: {},
    coordonnees: {
        adresse_siege: {
            commune: "paris"
        }
    },
    rib: fixtureRib,
    etablissement: fixtureEtablissements
} as unknown as StructureDto