import { StructureIdentifier } from "../identifier-objects/@types/StructureIdentifier";

export interface StructureProvider {
    getEntitiesByIdentifier(identifier: StructureIdentifier): Promise<unknown[]>;
}
