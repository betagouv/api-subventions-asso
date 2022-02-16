import { Siren } from "../../@types/Siren";
import { Siret } from "../../@types/Siret";

export function siretToSiren(siret: Siret): Siren {
    return siret.slice(0,9);
}

export function siretToNIC(siret: Siret) {
    return siret.slice(9, 14);
}