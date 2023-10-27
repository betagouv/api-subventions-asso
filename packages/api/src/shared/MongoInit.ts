import { repositoriesWithIndexes } from "../modules/repository.list";
import { asyncForEach } from "./helpers/ArrayHelper";
export const initIndexes = () => asyncForEach(repositoriesWithIndexes, repository => repository.createIndexes());
