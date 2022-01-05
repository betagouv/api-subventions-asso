export default class LeCompteAssoFileEntity {
    constructor(
        readonly lcaId: string,
        readonly siret: string,
        readonly name: string,
        readonly deviceName: string,
        readonly subDeviceName: string,
        readonly pluriannuality: string,
        readonly fiscalYearStart: number,
        readonly fiscalYearEnd: number,
        readonly projects: number,
        readonly createdAt: string,
        readonly transmittedAt: string,
        readonly creator: string,
        readonly deleted: string,
        readonly technicalId: string,
        readonly service: string,
        readonly state: string,
        readonly stateCRF: string,
    ) {}
}