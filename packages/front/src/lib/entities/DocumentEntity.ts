import type { SiretDto } from "dto";

export interface DocumentEntity {
    type: string;
    url: string;
    nom: string;
    label: string;
    provider: string;
    date: Date;
    __meta__: {
        siret: SiretDto;
    };
}
