import { ApplicationFlatEntity } from "./flats/ApplicationFlatEntity";
import PaymentFlatEntity from "./flats/PaymentFlatEntity";

export type GrantFlatEntity = { application: ApplicationFlatEntity | null; payments: PaymentFlatEntity[] };
