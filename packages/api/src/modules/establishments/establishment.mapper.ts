import { Establishment, EstablishmentSimplified } from "dto";

export class EstablishmentMapper {
    static toSimplifiedEstablishment(establishment: Establishment) {
        const { siret, nic, siege, ouvert, adresse, headcount } = establishment;
        return {
            siret,
            nic,
            siege,
            ouvert,
            adresse,
            headcount,
        } as EstablishmentSimplified;
    }
}
