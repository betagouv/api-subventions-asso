import { ScdlParsedGrant } from "./ScdlParsedGrant";

export type ScdlStorableGrant = ScdlParsedGrant & { __data__: Record<string, unknown> };
