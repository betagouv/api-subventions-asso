import Rna from "../../../identifierObjects/Rna";
import Siret from "../../../identifierObjects/Siret";
import RequestEntity from "../entities/RequestEntity";

export default interface ProviderRequestInterface {
    findBySiret(siret: Siret): Promise<RequestEntity[]>;
    findByRna(rna: Rna): Promise<RequestEntity[]>;
}
