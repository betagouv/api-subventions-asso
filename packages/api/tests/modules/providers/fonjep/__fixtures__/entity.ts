import FonjepEntity from "../../../../../src/modules/providers/fonjep/entities/FonjepSubventionEntity";
import FonjepPaymentEntity from "../../../../../src/modules/providers/fonjep/entities/FonjepPaymentEntity";
import DEFAULT_ASSOCIATION from "../../../../__fixtures__/association.fixture";

export const SubventionEntity = new FonjepEntity(
    {
        siret: DEFAULT_ASSOCIATION.siret,
        name: DEFAULT_ASSOCIATION.name,
    },
    {
        unique_id: "unique_id",
        code_poste: "J00034",
        montant_paye: 500,
        status: "Attribué",
        raison: "Reconduction",
        plein_temps: "Oui",
        service_instructeur: "XXX",
        annee_demande: 2022,
        updated_at: new Date("2022-01-02"),
        date_fin_triennale: new Date("2022-01-03"),
        code_postal: "75000",
        ville: "Paris",
        contact: "contact@beta.gouv.fr",
        type_post: "POSTE",
        dispositif: "Dispositif",
    },
    {},
);

export const PaymentEntity = new FonjepPaymentEntity(
    {
        siret: DEFAULT_ASSOCIATION.siret,
    },
    {
        unique_id: "unique_id",
        code_poste: "J00034",
        updated_at: new Date("2022-01-02"),
        periode_debut: new Date("2022-01-02"),
        periode_fin: new Date("2022-01-02"),
        date_versement: new Date("2022-01-02"),
        montant_paye: 1000,
        montant_a_payer: 1000,
        bop: 163,
    },
    {},
);
