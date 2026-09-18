import { OptionalId } from "mongodb";
import { SireneUniteLegaleEntity } from "../../../../entities/SireneUniteLegaleEntity";

export type SireneUniteLegaleDbo = Omit<
    OptionalId<SireneUniteLegaleEntity>,
    "siren" | "identifiantAssociationUniteLegale"
> & {
    siren: string;
    identifiantAssociationUniteLegale: string;
};
