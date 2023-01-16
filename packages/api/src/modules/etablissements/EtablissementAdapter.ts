import { Etablissement, SimplifiedEtablissement } from "@api-subventions-asso/dto";

export class EtablissementAdapter {
    static toSimplifiedEtablissement(etablissement: Etablissement) {
        const { siret, nic, siege, ouvert, adresse, headcount } = etablissement;
        return {
            siret,
            nic,
            siege,
            ouvert,
            adresse,
            headcount
        } as SimplifiedEtablissement;
    }
}
