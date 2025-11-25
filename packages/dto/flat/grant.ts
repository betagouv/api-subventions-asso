import { ApplicationFlatDto } from "./application";
import { PaymentFlatDto } from "./payment";

export type GrantFlatDto = { application: ApplicationFlatDto | null; payments: PaymentFlatDto[] };
