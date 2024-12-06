import { portsWithIndexes } from "../modules/port.list";
import { asyncForEach } from "./helpers/ArrayHelper";
export const initIndexes = () => asyncForEach(portsWithIndexes, port => port.createIndexes());
