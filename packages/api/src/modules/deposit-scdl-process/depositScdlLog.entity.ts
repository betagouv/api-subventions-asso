import { ProviderDataEntity } from "../../@types/ProviderData";

export default class DepositScdlLogEntity implements ProviderDataEntity {
    constructor(
        public userId: string,
        public step: number,
        public updateDate: Date = new Date(),
        public overwriteAlert: boolean,
        public permissionAlert: boolean,
        public id?: string,
        public grantOrgSiret?: string,
    ) {}
}
