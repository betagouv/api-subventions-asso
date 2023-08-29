import { Etablissement, SimplifiedEtablissement } from "dto";

export class EtablissementAdapter {
    static toSimplifiedEtablissement(etablissement: Etablissement) {
        const { siret, nic, siege, ouvert, adresse, headcount } = etablissement;
        return {
            siret,
            nic,
            siege,
            ouvert,
            adresse,
            headcount,
        } as SimplifiedEtablissement;
    }
}
