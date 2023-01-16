import RequestEntity from "../entities/RequestEntity";

export default interface ProviderRequestInterface {
    findBySiret(siret: string): Promise<RequestEntity[]>;
    findByRna(rna: string): Promise<RequestEntity[]>;
}
