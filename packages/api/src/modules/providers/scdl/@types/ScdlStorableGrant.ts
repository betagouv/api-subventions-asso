import { ScdlGrantEntity } from "./ScdlGrantEntity";

export type ScdlStorableGrant = Omit<ScdlGrantEntity, "allocatorName"> & { __data__: Record<string, unknown> };
