import { StructureIdentifier } from "../identifierObjects/@types/StructureIdentifier";

export interface StructureProvider {
    getEntitiesByIdentifier(identifier: StructureIdentifier): Promise<unknown[]>;
}
