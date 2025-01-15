export interface ScdlFileProcessingConfig {
    name: string;
    parseParams: string[];
    addProducer: boolean;
    producerName?: string;
    producerSiret?: string;
}

export interface ScdlFileProcessingConfigList {
    files: ScdlFileProcessingConfig[];
}
