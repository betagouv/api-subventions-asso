import { ApplicationFlatDto } from "./application";
import { PaymentFlatDto } from "./payment";

/** Subvention agrégée : demande et versements associés (format plat) */
export type GrantFlatDto = {
    /** Demande de subvention associée. Null si versements sans demande connue. */
    application: ApplicationFlatDto | null;
    /** Versements liés à cette demande */
    payments: PaymentFlatDto[];
};
