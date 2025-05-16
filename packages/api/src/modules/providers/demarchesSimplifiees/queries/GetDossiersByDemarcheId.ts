import dedent from "dedent";

export default dedent`query getDemarche($demarcheNumber: Int!, $after: String) { 
    demarche(number: $demarcheNumber) { 
        dossiers(after: $after) {              
            pageInfo {
                hasPreviousPage
                hasNextPage
                endCursor
            }    
            nodes { 
                id demandeur { 
                    ... on PersonneMorale { 
                        siret,
                        association {
                            rna,
                            titre
                        }
                    } 
                }
                id demarche {
                    title,
                }
                id groupeInstructeur {
                    label
                }
                motivation
                state
                dateDepot
                datePassageEnInstruction
                dateDerniereModification
                dateTraitement
                pdf {
                    url,
                    filename,
                    contentType
                }
                champs {
                    id
                    label,
                    stringValue
                }
                annotations {
                    id
                    label,
                    stringValue
                }
            }
        } 
        service {
            nom
            organisme
        }
        state
    } 
}`;
