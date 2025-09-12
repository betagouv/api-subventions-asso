export default interface FonjepIndexedInformations {
    updated_at: Date;
    unique_id: string;
    code_poste: string;
    montant_paye: number;
    status: string;
    raison: string;
    plein_temps: string;
    service_instructeur: string;
    annee_demande: number;
    date_fin_triennale: Date;
    type_post: string;
    ville: string;
    code_postal?: string;
    contact: string;
    dispositif: string;
    joinKey: string;
}
