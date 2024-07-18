/** Giulia asks : pourquoi des fois on utilise une class
 * des fois une interface pour definit les entités c'est plus précis les classes ?*/

import { Siren, Siret } from "dto";

export default class PaymentFlatEntity {
    constructor(
        public siret: Siret,
        public siren: Siren,
        public amount: number,
        public operationDate: Date,
        public programName: string,
        public programNumber: number,
        public mission: string,
        public ministry: string,
        public ministryAcronym: string,
        public ej: string,
        public provider: string,
        public actionCode: string,
        public actionLabel: string,
        public activityCode: string,
        public activityLabel: string,
    ) {}
}
