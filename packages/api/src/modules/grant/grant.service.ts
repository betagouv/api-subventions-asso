import { ApplicationFlatDto, PaymentFlatDto, GrantFlatDto } from "dto";
import { StructureIdentifier } from "../../identifier-objects/@types/StructureIdentifier";
import { GrantFlatEntity } from "../../entities/GrantFlatEntity";
import PaymentFlatEntity from "../../entities/flats/PaymentFlatEntity";
import ApplicationFlatMapper from "../application-flat/application-flat.mapper";
import PaymentFlatMapper from "../payment-flat/payment-flat.mapper";
import getApplications, { GetApplications } from "../application-flat/use-cases/get-applications";
import getPayments, { GetPayments } from "../payment-flat/use-cases/get-payments";

export class GrantService {
    constructor(
        private getApplications: GetApplications,
        private getPayments: GetPayments,
    ) {}

    async getGrantsDto(identifier: StructureIdentifier): Promise<GrantFlatDto[]> {
        const grants = await this.getGrants(identifier);

        return grants.map(grant => {
            const { application, payments } = grant;
            let applicationDto: ApplicationFlatDto | null = null;
            let paymentsDto: PaymentFlatDto[] = [];
            if (application) applicationDto = ApplicationFlatMapper.toDto(application);
            if (payments) paymentsDto = payments.map(PaymentFlatMapper.toDto);
            return { application: applicationDto, payments: paymentsDto };
        });
    }

    async getGrants(identifier: StructureIdentifier): Promise<GrantFlatEntity[]> {
        const applications = await this.getApplications.execute(identifier);
        const payments = await this.getPayments.execute(identifier);

        // init with applications
        const grants: GrantFlatEntity[] = applications.map(application => ({
            application,
            payments: [] as PaymentFlatEntity[],
        }));

        // group payments by paymentId
        const groupedPayments = payments.reduce(
            (acc, payment) => {
                const paymentId = payment.paymentId;
                if (acc[paymentId]) acc[paymentId].push(payment);
                else acc[paymentId] = [payment];
                return acc;
            },
            {} as Record<string, PaymentFlatEntity[]>,
        );

        // add payments either to existing grant with application or create a new grant without
        // uses different array to ease the findIndex
        Object.entries(groupedPayments).map(([paymentId, group]) => {
            const index = grants.findIndex(grant => {
                return grant.application?.paymentId === paymentId;
            });
            if (index >= 0) {
                grants[index].payments = group;
            } else {
                grants.push({ application: null, payments: group });
            }
        });

        return grants;
    }
}

const grantService = new GrantService(getApplications, getPayments);

export default grantService;
