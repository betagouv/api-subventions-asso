/**
 * /!\ This DTO is not complete, because no docs are found, so we complete as we go along.
 */
export default interface DauphinDocumentDto {
    reference: string;
    libelle: { value: string; lang?: string };
    documents: {
        id: string; // this is what we want to download later
        href: string; // this only gets meta-data somehow
        title: string;
        rel: string;
        error?: never;
        expand: {
            properties: {
                "entity:document:date": { value: string }; // using this as "date de dépôt"
                "cmis:creationDate": { value: number };
                "cmis:lastModificationDate": { value: number };
            };
            propertiesExtension: Record<string, unknown>;
        };
    }[];
}

export interface DauphinDocumentFromApplicationDto extends DauphinDocumentDto {
    description: { value: string };
    modeTransmission: string;
    conforme: boolean;
    fonction: string;
    obligatoire: boolean;
    obligatoireSurRecevabilite: boolean;
}
