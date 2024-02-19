import { ScdlGrantEntity } from "./ScdlGrantEntity";

export type ScdlStorableGrant = ScdlGrantEntity & { __data__: Record<string, unknown> };
