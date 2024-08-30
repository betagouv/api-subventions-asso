import SubventiaDto from "../../@types/subventia.dto";

export type Problem = { field: string; value: unknown; message: string };

export type ParsedDataWithProblem = Problem & SubventiaDto;
