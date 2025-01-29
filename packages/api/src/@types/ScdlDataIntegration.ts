export interface BaseScdlParseArgs {
    producerSlug: string;
    exportDate: string;
}

export interface ScdlParseArgs extends BaseScdlParseArgs {
    delimiter?: string;
    quote?: string;
}

export interface ScdlParseXlsArgs extends BaseScdlParseArgs {
    pageName?: string;
    rowOffset?: number | string;
}

export interface ScdlFileProcessingConfig {
    name: string;
    parseParams: ScdlParseArgs | ScdlParseXlsArgs;
    addProducer: boolean;
    producerName?: string;
    producerSiret?: string;
}

export interface ScdlFileProcessingConfigList {
    files: ScdlFileProcessingConfig[];
}
