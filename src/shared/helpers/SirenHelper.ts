import { Siret } from "../../@types/Siret";

export function siretToSiren(siret: Siret) {
    return siret.slice(0,9);
}