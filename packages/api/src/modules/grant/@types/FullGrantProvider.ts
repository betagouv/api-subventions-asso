import { Grant } from "dto";
import { RawFullGrant } from "./rawGrant";
import GrantProvider from "./GrantProvider";

export interface FullGrantProvider<T1, T2> extends GrantProvider {
    isFullGrantProvider: boolean;
    rawToGrant: (rawFullGrant: RawFullGrant<T1, T2>) => Grant;
}
