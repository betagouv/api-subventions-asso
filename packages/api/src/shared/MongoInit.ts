import { adaptersWithIndexes } from "../dataProviders/db/adapter.list";
import { asyncForEach } from "./helpers/ArrayHelper";
export const initIndexes = () => asyncForEach(adaptersWithIndexes, adapter => adapter.createIndexes());
