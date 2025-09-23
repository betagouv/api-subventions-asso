import { Association, Establishment } from "dto";
import apiAssoService from "../../src/modules/providers/apiAsso/apiAsso.service";
import ProviderValueFactory from "../../src/shared/ProviderValueFactory";

export const SIREN_STR = "100000000";
export const NIC_STR = "00001";
export const SIRET_STR = SIREN_STR + NIC_STR;
export const RNA_STR = "W000000000";
export const NAME = "L'Asso Imaginaire";
export const LONELY_RNA = "W999999999";
export const RIDET_STR = "1234567891";

const DEFAULT_ASSOCIATION = {
    siren: SIREN_STR,
    siret: SIRET_STR,
    rna: RNA_STR,
    name: "DEFAULT_ASSOCIATION",
};

/**
 * API ASSO IS USED TO TEST ASSOCIATION HTTP INTERFACE
 */

const apiAssoToPVs = ProviderValueFactory.buildProviderValuesAdapter(apiAssoService.meta.name, new Date("2025-06-25"));

const API_ASSO_ADDRESS = {
    numero: "47",
    type_voie: "rue",
    voie: "d'Antrain",
    code_postal: "35000",
    commune: "Rennes",
};

export const API_ASSO_ASSOCIATION_FROM_SIREN: Association = {
    siren: apiAssoToPVs(SIREN_STR),
    nic_siege: apiAssoToPVs(NIC_STR),
    categorie_juridique: apiAssoToPVs("Association loi 1901"),
    denomination_siren: apiAssoToPVs(NAME),
    date_creation_siren: apiAssoToPVs(new Date("1986-10-14")),
    adresse_siege_siren: apiAssoToPVs(API_ASSO_ADDRESS),
    date_modification_siren: apiAssoToPVs(new Date("2025-04-12")),
    etablisements_siret: apiAssoToPVs([SIRET_STR]),
};

const API_ASSO_PRESIDENT = {
    nom: "Dupont",
    prenom: "Martin",
    civilite: "Monsieur",
    telephone: "0606060606",
    email: "dupont.martin@academie.fr",
    role: "Président",
};

const API_ASSO_CONTACT = {
    nom: "Lasalle",
    prenom: "Jeanne",
    civilite: "Madame",
    telephone: "0707070707",
    email: "lasalle-jeanne@gmail.com",
    role: "Photographe",
};

export const API_ASSO_ESTABLISHMENTS_FROM_SIREN: Establishment[] = [
    {
        siret: apiAssoToPVs(SIRET_STR),
        nic: apiAssoToPVs(NIC_STR),
        siege: apiAssoToPVs(true),
        ouvert: apiAssoToPVs(true),
        adresse: apiAssoToPVs(API_ASSO_ADDRESS),
        headcount: apiAssoToPVs("12"),
        representants_legaux: [apiAssoToPVs(API_ASSO_PRESIDENT)],
        contacts: [apiAssoToPVs(API_ASSO_PRESIDENT), apiAssoToPVs(API_ASSO_CONTACT)],
        demandes_subventions: [],
        information_banquaire: [],
    },
    {
        siret: apiAssoToPVs(SIRET_STR),
        nic: apiAssoToPVs("00002"),
        siege: apiAssoToPVs(false),
        ouvert: apiAssoToPVs(false),
        adresse: apiAssoToPVs({
            numero: "12",
            type_voie: "avenue",
            voie: "du Général Leclerc",
            code_postal: "35700",
            commune: "Rennes",
        }),
        headcount: apiAssoToPVs("0"),
        representants_legaux: [],
        contacts: [],
        demandes_subventions: [],
        information_banquaire: [],
    },
];

export default DEFAULT_ASSOCIATION;
