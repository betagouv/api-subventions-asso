export type ScdlParseArgs = [producerSlug: string, exportDate: string, delimiter?: string, quote?: string];

export type ScdlParseXlsArgs = [
    producerSlug: string,
    exportDate: string,
    pageName?: string,
    rowOffsetStr?: number | string,
];

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
