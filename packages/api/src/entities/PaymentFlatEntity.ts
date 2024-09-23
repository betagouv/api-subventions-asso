import { Siren, Siret } from "dto";

export default class PaymentFlatEntity {
    constructor(
        public uniqueId: string,
        public siret: Siret,
        public siren: Siren,
        public amount: number,
        public operationDate: Date,
        public programName: string | null,
        public programNumber: number,
        public mission: string | null,
        public ministry: string | null,
        public ministryAcronym: string | null,
        public ej: string,
        public provider: string,
        public actionCode: string,
        public actionLabel: string | null,
        public activityCode: string | null,
        public activityLabel: string | null,
    ) {}
}
