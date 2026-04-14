import { ProviderDataEntity } from "../../../../@types/ProviderData";

export default interface HeliosEntity extends ProviderDataEntity {
    codeDep: string;
    codeInseeBc: string;
    collec: string;
    compteNature: number;
    dateEmission: Date;
    datePaiement: Date;
    id: string;
    immatriculation: string;
    montantPaiment: number;
    nom: string;
    nomenclature: string;
    numeroLigne: number;
    numMandat: number;
    natureJuridique: string;
    objectMandat: string;
    typeMandat: string;
    typeBudgetCollectivite: string;
    typeImmatriculation: string;
}
