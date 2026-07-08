import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import StructureDto, {
    StructureDacDocumentDto,
    StructureEstablishmentDto,
    StructureRepresentantLegalDto,
    StructureRibDto,
    StructureRnaDocumentDto,
} from "../dto/StructureDto";

// @ts-expect-error incomplete fixture
export const STRUCTURE_ESTABLISHMENT_DTO: StructureEstablishmentDto = {
    id_siret: 50922194100000,
    adresse: {},
};

export const fixtureEstablishments = [
    STRUCTURE_ESTABLISHMENT_DTO,
    {
        id_siret: 50922194100001,
        adresse: {},
    },
] as StructureEstablishmentDto[];

export const fixtureDocumentRna = [
    {
        url: "/fake/url",
        type: "PV",
        sous_type: "PV",
        id: "ididididid",
        time: 1622557171,
        annee: 2021,
    },
] as StructureRnaDocumentDto[];

export const fixtureDocumentDac = [
    {
        url: "/fake/url",
        nom: "nom fake",
        meta: {
            type: "BPA",
            id_siret: 50922194100000,
            etat: "courant",
        },
        time_depot: "2021-06-18 12:02:53",
    },
] as StructureDacDocumentDto[];

export const fixtureRib = [
    {
        id_siret: 50922194100000,
        iban: "TEST",
        bic: "BIC_TEST",
    },
    {
        id_siret: 50922194100000,
        iban: "TEST 2",
        bic: "BIC_TEST 2",
        url: "fake/path/to/rib",
    },
] as StructureRibDto[];

export const fixtureRepresentantLegal = [
    {
        nom: "Jedusor",
        prenom: "Tom",
        role: "Mage pas simpa",
        id_siret: 50922194100000,
    },
] as unknown as StructureRepresentantLegalDto[];

export const fixtureAsso: StructureDto = {
    identite: {
        nom: "TEST",
        nom_sirene: "TEST SIREN 2",
        id_rna: DEFAULT_ASSOCIATION.rna,
        id_siren: DEFAULT_ASSOCIATION.siren,
        id_siret_siege: Number(DEFAULT_ASSOCIATION.siret),
        id_forme_juridique: "9220",
        date_creat: "1994-07-04",
        date_creation_sirene: "1985-02-26",
        date_modif_rna: "2018-01-01",
        date_modif_siren: "2010-01-01",
    } as StructureDto["identite"],
    activites: {} as StructureDto["activites"],
    coordonnees: {
        adresse_siege: {
            commune: "paris",
        },
    },
    ribs: { rib: fixtureRib },
    etablissements: fixtureEstablishments,
    document_rna: fixtureDocumentRna,
    document_dac: fixtureDocumentDac,
    reseau_affiliation: [],
    composition_reseau: [],
    adherent_personne_morales: [],
    representant_legal: [],
    agrement: [],
    rh: [],
    compte: [],
    rib: [],
} as StructureDto;
