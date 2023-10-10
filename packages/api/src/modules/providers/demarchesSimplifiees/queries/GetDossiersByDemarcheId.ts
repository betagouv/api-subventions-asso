import dedent from "dedent";

export default dedent`query getDemarche($demarcheNumber: Int!) { 
    demarche(number: $demarcheNumber) { 
        dossiers {             
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
    } 
}`;
