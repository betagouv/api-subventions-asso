export interface DepositScdlLogDto {
    // todo : props en francais
    userId: string;
    step: number;
    overwriteAlert?: boolean;
    grantOrgSiret?: string;
    permissionAlert?: boolean;
}
