import moment from "moment";
import * as lodash from "lodash";
import { ApplicationStatus, CommonApplicationDto, DemandeSubvention, ProviderValue } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import demarchesSimplifieesService from "../demarchesSimplifiees.service";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesSchema from "../entities/DemarchesSimplifieesSchema";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { stringIsFloat } from "../../../../shared/helpers/StringHelper";
import { DefaultObject } from "../../../../@types";
import { DemarchesSimplifieesRawData, DemarchesSimplifieesRawGrant } from "../@types/DemarchesSimplifieesRawGrant";
import { RawApplication } from "../../../grant/@types/rawGrant";
import { toStatusFactory } from "../../providers.adapter";
import { isNumberValid } from "../../../../shared/Validators";
import { ApplicationFlatEntity } from "../../../../entities/ApplicationFlatEntity";
import { InternalServerError } from "core";

export class DemarchesSimplifieesEntityAdapter {
    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["refuse"] },
        { label: ApplicationStatus.GRANTED, providerStatusList: ["accepte"] },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["sans_suite"] },
        { label: ApplicationStatus.PENDING, providerStatusList: ["en_instruction"] },
    ];

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

    static rawToApplication(rawApplication: RawApplication<DemarchesSimplifieesRawData>) {
        const { entity, schema } = rawApplication.data;
        return this.toSubvention(entity, schema);
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

    static toSubvention(entity: DemarchesSimplifieesDataEntity, schema: DemarchesSimplifieesSchema): DemandeSubvention {
        const toPv = ProviderValueFactory.buildProviderValueAdapter(
            demarchesSimplifieesService.provider.name,
            new Date(entity.demande.dateDerniereModification),
        );

        const subvention: DefaultObject = DemarchesSimplifieesEntityAdapter.mapSchema(entity, schema, "schema");

        if (!subvention.siret) subvention.siret = entity.siret;
        if (!subvention.annee_demande) {
            if (subvention.exercice && isNumberValid(Number(subvention.exercice)))
                subvention.annee_demande = subvention.exercice;
            // DS often doesn't always have an attribute with only year, so we get year from the start date
            else if (subvention.date_debut && isValidDate(subvention.date_debut))
                subvention.annee_demande = (subvention.date_debut as Date).getFullYear();
        }

        subvention.statut_label = toStatusFactory(DemarchesSimplifieesEntityAdapter._statusConversionArray)(
            subvention.status as string,
        );
        return DemarchesSimplifieesEntityAdapter.nestedToProviderValues(subvention, toPv) as DemandeSubvention;
    }

    static toRawGrant(
        entity: DemarchesSimplifieesDataEntity,
        schema: DemarchesSimplifieesSchema,
    ): DemarchesSimplifieesRawGrant {
        const joinKey = demarchesSimplifieesService.getJoinKey({ entity, schema: schema });

        return {
            provider: demarchesSimplifieesService.provider.id,
            type: "application",
            data: { entity, schema: schema },
            joinKey,
        };
    }

    static toCommon(entity: DemarchesSimplifieesDataEntity, schema: DemarchesSimplifieesSchema): CommonApplicationDto {
        const application: DefaultObject = DemarchesSimplifieesEntityAdapter.mapSchema(entity, schema, "commonSchema");

        if (!application.siret) application.siret = entity.siret;
        if (!application.exercice && application.dateTransmitted)
            application.exercice = new Date(application.dateTransmitted as string)?.getFullYear();
        delete application.dateTransmitted;

        application.statut = toStatusFactory(DemarchesSimplifieesEntityAdapter._statusConversionArray)(
            application.providerStatus as string,
        );
        delete application.providerStatus;

        return application as unknown as CommonApplicationDto;
    }

    static toFlat(entity: DemarchesSimplifieesDataEntity, schema: DemarchesSimplifieesSchema): ApplicationFlatEntity {
        const application: DefaultObject = DemarchesSimplifieesEntityAdapter.mapSchema(entity, schema, "flatSchema");

        application.statutLabel = toStatusFactory(DemarchesSimplifieesEntityAdapter._statusConversionArray)(
            application.status as string,
        );
        delete application.status;

        // TODO should we try better to have exercise ?

        application.beneficiaryEstablishmentIdType = "siret";
        application.provider = `demarches-simplifiees-${entity.demarcheId}`;
        application.beneficiaryEstablishmentId = (application.beneficiaryEstablishmentId as number).toString();
        application.applicationId = `${application.provider}-${application.applicationProviderId}`;
        application.uniqueId = `${application.applicationId}-${application.budgetaryYear}`;
        application.paymentId = `${application.beneficiaryEstablishmentId}-${application.ej}-${application.budgetaryYear}`; //siret-EJ-exerciceBudgetaire
        application.requestYear = new Date(application.depositDate as string).getFullYear();

        return application as unknown as ApplicationFlatEntity;
    }
}
