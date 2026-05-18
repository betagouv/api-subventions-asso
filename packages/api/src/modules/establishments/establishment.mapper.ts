import { EstablishmentWithProviderValues, EstablishmentSimplifiedWithProviderValues } from "dto";

export class EstablishmentMapper {
    static toSimplifiedEstablishment(establishment: EstablishmentWithProviderValues) {
        const { siret, nic, siege, ouvert, adresse, headcount } = establishment;
        return {
            siret,
            nic,
            siege,
            ouvert,
            adresse,
            headcount,
        } as EstablishmentSimplifiedWithProviderValues;
    }
}
