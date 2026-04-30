export type OsirisRequestDtoValue = string | number | boolean | Date | null | undefined;

export type OsirisRequestDtoCategory = Record<string, OsirisRequestDtoValue>;

type OsirisRequestDto = Record<string, OsirisRequestDtoCategory>;

export default OsirisRequestDto;
