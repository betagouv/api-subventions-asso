import { portsWithIndexes } from "../dataProviders/port.list";
import { asyncForEach } from "./helpers/ArrayHelper";
export const initIndexes = () => asyncForEach(portsWithIndexes, port => port.createIndexes());
