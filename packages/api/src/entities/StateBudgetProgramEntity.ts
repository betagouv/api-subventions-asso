/**
 * Represents a state budget program entity.
 */
export default class StateBudgetProgramEntity {
    /**
     * Creates a new instance of the StateBudgetProgramEntity class.
     * @param mission - The mission of the program.
     * @param label_programme - The label of the program.
     * @param code_ministere - The ministry code of the program.
     * @param code_programme - The program code.
     */
    constructor(
        public mission: string | null,
        public label_programme: string,
        public code_ministere: string,
        public code_programme: number,
    ) {}
}
