import apiAssoAdapter from "../../../../adapters/outputs/api/api-asso/api-asso.adapter";
import FindRnaSirenUseCase from "./find-rna-siren.use-case";

export const createFindRnaSirenUseCase = () => {
    return new FindRnaSirenUseCase(apiAssoAdapter);
};
