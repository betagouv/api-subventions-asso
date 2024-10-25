import { Association } from "dto";
import Provider from "../../providers/@types/IProvider";
import AssociationIdentifier from "../../../valueObjects/AssociationIdentifier";

export default interface AssociationsProvider extends Provider {
    isAssociationsProvider: boolean;

    getAssociations(identifier: AssociationIdentifier): Promise<Association[]>;
}
