import { CreateDepositScdlLogDto } from "./CreateDepositScdlLogDto";

export interface DepositScdlLogDto extends CreateDepositScdlLogDto {
    grantOrgSiret?: string;
    permissionAlert: boolean;
}
