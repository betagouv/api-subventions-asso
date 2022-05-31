import FonjepEntity from '../../../../../src/modules/providers/fonjep/entities/FonjepRequestEntity';

export default new FonjepEntity(
    {
        siret: "00000000000002",
        name: "FONJET_ENTITY_FIXTURE"
    },
    {
        unique_id: "unique_id",
        montant_paye: 500,
        status: "En cours",
        plein_temps: "Oui",
        service_instructeur: "XXX",
        annee_demande: 2022,
        updated_at: new Date("2022-01-02"),
        date_fin_triennale: new Date("2022-01-03"),
        code_postal: "75000",
        ville: "Paris",
        contact: "contact@beta.gouv.fr",
        type_post: "POSTE",
        co_financeur: "CoFinanceur",
        co_financeur_contact: "co.financeur@email.fr",
        co_financeur_siret: "00230104",
        co_financeur_montant: 1700,
    },
    {}
)