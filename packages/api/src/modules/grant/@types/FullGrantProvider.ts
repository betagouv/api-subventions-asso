import { Grant } from "dto";
import { RawFullGrant } from "./rawGrant";
import GrantProvider from "./GrantProvider";

// TODO: move this file somewhere else ?
export interface FullGrantProvider<T> extends GrantProvider {
    isFullGrantProvider: boolean;
    rawToGrant: (rawFullGrant: RawFullGrant<T>) => Grant | null;
}
