import moment from "moment";
import * as lodash from "lodash";
import { ApplicationStatus, ProviderValue } from "dto";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesSchema from "../entities/DemarchesSimplifieesSchema";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { stringIsFloat } from "../../../../shared/helpers/StringHelper";
import { DefaultObject } from "../../../../@types";
import { toStatusFactory } from "../../providers.adapter";
import { ApplicationFlatEntity } from "../../../../entities/ApplicationFlatEntity";
import { InternalServerError } from "core";
import Siret from "../../../../identifierObjects/Siret";

export class DemarchesSimplifieesEntityAdapter {
    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["refuse"] },
        { label: ApplicationStatus.GRANTED, providerStatusList: ["accepte"] },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["sans_suite"] },
        { label: ApplicationStatus.PENDING, providerStatusList: ["en_instruction"] },
    ];
    private static baseFlatWithNull: Partial<ApplicationFlatEntity> = {
        allocatorId: null,
        allocatorIdType: null,
        allocatorName: null,
        budgetaryYear: null,
        cofinancersIdType: null,
        cofinancersNames: null,
        cofinancingRequested: null,
        confinancersId: null,
        conventionDate: null,
        decisionDate: null,
        decisionReference: null,
        depositDate: null,
        ej: null,
        grantedAmount: null,
        idRAE: null,
        instructiveDepartementId: null,
        instructiveDepartmentIdType: null,
        instructiveDepartmentName: null,
        joinKeyDesc: null,
        joinKeyId: null,
        managingAuthorityId: null,
        managingAuthorityIdType: null,
        managingAuthorityName: null,
        nature: null,
        object: null,
        paymentCondition: null,
        paymentConditionDesc: null,
        paymentId: null,
        paymentPeriodDates: null,
        pluriannual: null,
        pluriannualYears: null,
        requestYear: null,
        requestedAmount: null,
        scheme: null,
        subScheme: null,
        subventionPercentage: null,
        totalAmount: null,
        ueNotification: null,
    };

    private static mapSchema<T>(
        entity: DemarchesSimplifieesDataEntity,
        schema: DemarchesSimplifieesSchema,
        schemaId: string,
    ): T {
        const subvention = {};
        if (!schema[schemaId]) {
            throw new InternalServerError(`no schema for type ${schemaId} and form ${schema.demarcheId}`);
        }

        schema[schemaId].forEach(property => {
            if (property.value) return lodash.set(subvention, property.to, property.value);

            let value = lodash.get(entity, property.from);
            const valueDate = [
                moment(value, "DD MMMM YYYY", "fr", true).toDate(), // Use moment for read French date
                moment(value, true), // use moment with strict params true, to force the reading of a date in js format and not an interpretation
                new Date(value),
            ].find(date => isValidDate(date));

            if (value === undefined || value === "") return;
            else if (stringIsFloat(value)) value = parseFloat(value);
            else value = valueDate || value;

            lodash.set(subvention, property.to, value);
        });

        return subvention as unknown as T;
    }

    private static nestedToProviderValues(object: object, toPv: (v: unknown) => ProviderValue<unknown>) {
        if (Array.isArray(object)) return object.map(v => this.nestedToProviderValues(v, toPv));
        if (object.constructor !== Object) return toPv(object);
        const res = {};
        for (const [key, value] of Object.entries(object)) {
            res[key] = DemarchesSimplifieesEntityAdapter.nestedToProviderValues(value, toPv);
        }
        return res;
    }

    static toFlat(entity: DemarchesSimplifieesDataEntity, schema: DemarchesSimplifieesSchema): ApplicationFlatEntity {
        const application: DefaultObject = {
            ...DemarchesSimplifieesEntityAdapter.baseFlatWithNull,
            ...DemarchesSimplifieesEntityAdapter.mapSchema(entity, schema, "flatSchema"),
        };

        application.statusLabel = toStatusFactory(DemarchesSimplifieesEntityAdapter._statusConversionArray)(
            application.status as string,
        );
        delete application.status;

        // TODO should we try better to have exercise ?

        application.beneficiaryEstablishmentIdType = Siret.getName();
        application.provider = `demarches-simplifiees-${entity.demarcheId}`;
        application.beneficiaryEstablishmentId = (application.beneficiaryEstablishmentId as number).toString();
        application.applicationId = `${application.provider}-${application.applicationProviderId}`;
        application.uniqueId = `${application.applicationId}-${application.budgetaryYear}`;
        application.paymentId = `${application.beneficiaryEstablishmentId}-${application.ej}-${application.budgetaryYear}`; //siret-EJ-exerciceBudgetaire
        application.depositDate = application.depositDate ? new Date(application.depositDate as string) : null;
        application.requestYear = application.depositDate ? (application.depositDate as Date).getFullYear() : null;

        return application as unknown as ApplicationFlatEntity;
    }
}
