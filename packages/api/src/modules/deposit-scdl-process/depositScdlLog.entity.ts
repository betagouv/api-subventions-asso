import { ProviderDataEntity } from "../../@types/ProviderData";

export default class DepositScdlLogEntity implements ProviderDataEntity {
    constructor(
        public userId: string,
        public step: number,
        public updateDate: Date = new Date(),
        public id?: string,
        public overwriteAlert?: boolean,
        public grantOrgSiret?: string,
        public permissionAlert?: boolean,
    ) {}
}
