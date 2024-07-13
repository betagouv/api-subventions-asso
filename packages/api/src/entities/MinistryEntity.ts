/**
 * Represents ministry entity.
 */
export default class MinistryEntity {
    /**
     * Creates a new instance of Ministry Entity class.
     * @param sigle_ministere - The minestry acronyme.
     * @param code_ministere - The ministry code.
     * @param nom_ministere - The ministry name.
     */
    constructor(
        /*
        normalement tous ces attributes devraient être
        non null, mais on ne peut pas être sûr à priori.
        Du coup est-ce qu'il faut mettre string | null ?
        Comment il gère les nulls si ont lui mets que string ?
        */
        public sigle_ministere: string,
        public code_ministere: string,
        public nom_ministere: string,
    ) {}
}
