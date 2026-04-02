import { Establishment } from "dto";
import Provider from "../../providers/@types/IProvider";
import { StructureIdentifier } from "../../../identifier-objects/@types/StructureIdentifier";

export default interface EstablishmentProvider extends Provider {
    isEstablishmentProvider: boolean;
    getEstablishments(identifier: StructureIdentifier): Promise<Establishment[]>;
}
