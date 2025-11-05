type BaseScdlParseArgs = { siret: string; exportDate?: string };
export type ScdlParseCsvArgs = BaseScdlParseArgs & { delimiter?: string; quote?: string };
export type ScdlParseXlsArgs = BaseScdlParseArgs & { pageName?: string; rowOffset?: number | string };

export type ScdlParseParams = ScdlParseCsvArgs | ScdlParseXlsArgs;

export interface ScdlFileProcessingConfig<T = ScdlParseParams> {
    name: string;
    parseParams: T;
    addProducer: boolean;
}

export interface ScdlFileProcessingConfigList {
    files: ScdlFileProcessingConfig[];
}

export type FileConfigErrors = { field: string }[];
