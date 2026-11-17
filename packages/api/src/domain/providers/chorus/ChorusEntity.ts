import { EstablishmentIdentifier } from "../../../identifier-objects";
import { EstablishmentIdType } from "../../../identifier-objects/@types/IdentifierType";

export interface ChorusProps {
    ej: string;
    numPosteEJ: string;
    siret: string;
    ridetOrTahitiet: string;
    codeBranche: string;
    branche: string;
    activitee: string;
    codeActivitee: string;
    numeroDemandePaiement: string;
    numPosteDP: string;
    codeSociete: string;
    exercice: number;
    numeroTier: string;
    nomStructure: string;
    centreFinancier: string;
    codeCentreFinancier: string;
    domaineFonctionnel: string;
    codeDomaineFonctionnel: string;
    montant: number;
    dateOperation: Date;
    updateDate: Date;
}

export default class ChorusEntity {
    public identifier: EstablishmentIdType;
    public ej: string;
    public numPosteEJ: string;
    public codeBranche: string;
    public branche: string;
    public activitee: string;
    public codeActivitee: string;
    public numeroDemandePaiement: string;
    public numPosteDP: string;
    public codeSociete: string;
    public exercice: number;
    public numeroTier: string;
    public nomStructure: string;
    public centreFinancier: string;
    public codeCentreFinancier: string;
    public domaineFonctionnel: string;
    public codeDomaineFonctionnel: string;
    public montant: number;
    public dateOperation: Date;
    public updateDate: Date;

    constructor(props: ChorusProps) {
        const identifierStr = props.siret === "#" ? props.ridetOrTahitiet : props.siret;

        const identifier = EstablishmentIdentifier.buildIdentifierFromString(identifierStr);
        if (!identifier) throw new Error("Invalid Identifier");

        this.identifier = identifier;
        this.ej = props.ej;
        this.numPosteEJ = props.numPosteEJ;
        this.codeBranche = props.codeBranche;
        this.branche = props.branche;
        this.activitee = props.activitee;
        this.codeActivitee = props.codeActivitee;
        this.numeroDemandePaiement = props.numeroDemandePaiement;
        this.numPosteDP = props.numPosteDP;
        this.codeSociete = props.codeSociete;
        this.exercice = props.exercice;
        this.numeroTier = props.numeroTier;
        this.nomStructure = props.nomStructure;
        this.centreFinancier = props.centreFinancier;
        this.codeCentreFinancier = props.codeCentreFinancier;
        this.domaineFonctionnel = props.domaineFonctionnel;
        this.codeDomaineFonctionnel = props.codeDomaineFonctionnel;
        this.montant = props.montant;
        this.dateOperation = props.dateOperation;
        this.updateDate = props.updateDate;
    }
}
