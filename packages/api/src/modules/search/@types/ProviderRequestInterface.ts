import Rna from "../../../valueObjects/Rna";
import Siret from "../../../valueObjects/Siret";
import RequestEntity from "../entities/RequestEntity";

export default interface ProviderRequestInterface {
    findBySiret(siret: Siret): Promise<RequestEntity[]>;
    findByRna(rna: Rna): Promise<RequestEntity[]>;
}
