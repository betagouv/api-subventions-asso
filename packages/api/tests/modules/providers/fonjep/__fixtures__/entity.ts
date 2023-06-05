import FonjepEntity from "../../../../../src/modules/providers/fonjep/entities/FonjepSubventionEntity";
import FonjepVersementEntity from "../../../../../src/modules/providers/fonjep/entities/FonjepVersementEntity";

export const SubventionEntity = new FonjepEntity(
    {
        siret: "00000000000002",
        name: "FONJET_ENTITY_FIXTURE",
    },
    {
        unique_id: "unique_id",
        code_poste: "D00000",
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

export const VersementEntity = new FonjepVersementEntity(
    {
        siret: "00000000000002",
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
    },
    {},
);
