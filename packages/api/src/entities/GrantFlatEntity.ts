import { ApplicationFlatEntity } from "./ApplicationFlatEntity";
import PaymentFlatEntity from "./PaymentFlatEntity";

export type GrantFlatEntity = { application: ApplicationFlatEntity | null; payments: PaymentFlatEntity[] };
