export default interface GisproEntity {
    ej: string;
    codeActionDossier: string;
    codeProjet: string;
    siret: string;
    directionGestionnaire?: string;
    exercise: number;
    typeProcédure?: string;
    montant?: number;
    typeBeneficiaire?: string;
}
