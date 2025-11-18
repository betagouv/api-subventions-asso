export type ScdlParseCsvArgs = { delimiter?: string; quote?: string };
export type ScdlParseXlsArgs = { pageName?: string; rowOffset?: number | string };

export type ScdlParseParams = ScdlParseCsvArgs | ScdlParseXlsArgs;

export interface ScdlFileProcessingConfig<T = ScdlParseParams> {
    name: string;
    allocatorSiret: string;
    parseParams?: T;
    addProducer?: boolean;
    exportDate?: string;
}

export interface ScdlFileProcessingConfigList {
    files: ScdlFileProcessingConfig[];
}

export type FileConfigErrors = { field: string }[];
