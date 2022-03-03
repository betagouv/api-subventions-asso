import EtablissementSirenInterface from "./EtablissementSirenInterface";

export default interface AssociationSirenInfertace {
    siren: string,
    categorie_juridique: string;
    nic_siege: string,
    etablissement_siege: EtablissementSirenInterface
    etablissements: EtablissementSirenInterface[]
}