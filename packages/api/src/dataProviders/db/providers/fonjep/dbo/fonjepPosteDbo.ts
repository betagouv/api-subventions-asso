import { WithId } from "mongodb";
import FonjepPosteEntity from "../../../../../modules/providers/fonjep/entities/FonjepPosteEntity";

type FonjepPosteDbo = WithId<FonjepPosteEntity>;
export default FonjepPosteDbo;
