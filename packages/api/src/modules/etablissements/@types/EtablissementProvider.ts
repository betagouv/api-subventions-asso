import { Etablissement } from "dto";
import Provider from "../../providers/@types/IProvider";
import { StructureIdentifier } from "../../../identifierObjects/@types/StructureIdentifier";

export default interface EtablissementProvider extends Provider {
    isEtablissementProvider: boolean;
    getEstablishments(identifier: StructureIdentifier): Promise<Etablissement[]>;
}
