import { WithId } from "mongodb";
import FonjepVersementEntity from "../../../../../modules/providers/fonjep/entities/FonjepVersementEntity";

type FonjepVersementDbo = WithId<FonjepVersementEntity>;
export default FonjepVersementDbo;
