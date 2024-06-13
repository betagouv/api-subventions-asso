import { Grant } from "dto";
import Provider from "../../providers/@types/IProvider";
import { RawFullGrant } from "./rawGrant";

export interface FullGrantProvider<T1, T2> extends Provider {
    isFullGrantProvider: boolean;
    rawToGrant: (rawFullGrant: RawFullGrant<T1, T2>) => Grant;
}
