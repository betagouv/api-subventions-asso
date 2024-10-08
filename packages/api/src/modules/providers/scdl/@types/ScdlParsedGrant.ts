import { ScdlGrantEntity } from "./ScdlGrantEntity";

export type ScdlParsedGrant = Omit<ScdlGrantEntity, "allocatorName" | "allocatorSiret"> &
    Pick<Partial<ScdlGrantEntity>, "allocatorName" | "allocatorSiret">;
