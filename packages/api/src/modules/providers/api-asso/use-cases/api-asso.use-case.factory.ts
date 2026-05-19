import apiAssoAdapter from "../../../../adapters/outputs/api/api-asso/api-asso.adapter";
import FindRnaSirenUseCase from "./find-rna-siren.use-case";
import GetRnaAssoUseCase from "./get-rna-asso.use-case";
import TransformRnaStructureToAssoUseCase from "./transform-rna-structure-to-asso.use-case";

export const findRnaSiren = new FindRnaSirenUseCase(apiAssoAdapter);
export const transformRnaStructureToAsso = new TransformRnaStructureToAssoUseCase();
export const getRnaAsso = new GetRnaAssoUseCase(apiAssoAdapter, transformRnaStructureToAsso);
