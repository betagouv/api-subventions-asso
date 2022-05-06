import FonjepEntity from '../../../../../src/modules/providers/fonjep/entities/FonjepRequestEntity';

export default new FonjepEntity(
    {
        siret: "00000000000000",
        name: "Fake name"
    },
    {
        unique_id: "unique_id",
        montant_paye: 500,
        status: "En cours",
        service_instructeur: "XXX",
        annee_demande: 2022,
        updated_at: new Date(),
        date_fin_triennale: new Date(),
        code_postal: "75000",
        ville: "Paris",
        contact: "contact@beta.gouv.fr",
        type_post: "POSTE"
    },
    {}
)