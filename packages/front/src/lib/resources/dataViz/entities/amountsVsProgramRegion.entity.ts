export default class AmountsVsProgramRegionEntity {
   
    constructor(
        public exerciceBudgetaire: number,
        public programme: string,
        public mission: string | null,
        public amount: number,
        public regionAttachementComptable: string) 
        {}
}