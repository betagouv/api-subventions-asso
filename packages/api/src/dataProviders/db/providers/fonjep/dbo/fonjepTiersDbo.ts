import { WithId } from "mongodb";
import FonjepTiersEntity from "../../../../../modules/providers/fonjep/entities/FonjepTiersEntity";

type FonjepTiersDbo = WithId<FonjepTiersEntity>;
export default FonjepTiersDbo;
