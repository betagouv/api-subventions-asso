export default interface IFonjepVersementIndexedInformations {
    unique_id: string;
    updated_at: Date;
    code_poste: string;
    periode_debut: Date;
    periode_fin: Date;
    date_versement: Date;
    montant_a_payer: number;
    montant_paye: number;
    bop: string | number;
}
