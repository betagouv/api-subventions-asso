export default interface IFonjepIndexedInformations {
    montant_paye: number,
    status: string,
    service_instructeur: string,
    annee_demande: number,
    date_versement: Date,
    date_fin_effet: Date,
    date_fin_triennale: Date,
    code_postal: string,
    ville: string,
    financeur_principal: string
}