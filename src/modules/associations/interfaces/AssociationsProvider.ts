import Association from "./Association";

export default interface AssociationsProvider {
    isAssociationsProvider: boolean,

    getAssociationsBySiren(siren: string): Promise<Association | null>;
}