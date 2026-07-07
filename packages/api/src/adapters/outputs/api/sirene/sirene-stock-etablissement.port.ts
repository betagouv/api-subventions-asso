import { Readable } from "stream";

export type SireneStockEtablissementResponse = {
    data: Readable;
};

export interface SireneStockEtablissementPort {
    getParquet(): Promise<SireneStockEtablissementResponse>;
}
