import { adaptersWithIndexes } from "../adapters/db/adapter.list";
import { asyncForEach } from "./helpers/ArrayHelper";
export const initIndexes = () => asyncForEach(adaptersWithIndexes, adapter => adapter.createIndexes());
