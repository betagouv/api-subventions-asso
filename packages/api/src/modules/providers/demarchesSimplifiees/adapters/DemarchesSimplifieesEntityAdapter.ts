import moment from "moment";
import * as lodash from "lodash";
import { ApplicationStatus, CommonApplicationDto, DemandeSubvention, ProviderValue } from "dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import demarchesSimplifieesService from "../demarchesSimplifiees.service";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesMapperEntity from "../entities/DemarchesSimplifieesMapperEntity";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { stringIsFloat } from "../../../../shared/helpers/StringHelper";
import { DefaultObject } from "../../../../@types";
import { DemarchesSimplifieesRawData, DemarchesSimplifieesRawGrant } from "../@types/DemarchesSimplifieesRawGrant";
import { RawApplication } from "../../../grant/@types/rawGrant";
import { toStatusFactory } from "../../providers.adapter";
import { isNumberValid } from "../../../../shared/Validators";

export class DemarchesSimplifieesEntityAdapter {
    private static _statusConversionArray: { label: ApplicationStatus; providerStatusList: string[] }[] = [
        { label: ApplicationStatus.REFUSED, providerStatusList: ["refuse"] },
        { label: ApplicationStatus.GRANTED, providerStatusList: ["accepte"] },
        { label: ApplicationStatus.INELIGIBLE, providerStatusList: ["sans_suite"] },
        { label: ApplicationStatus.PENDING, providerStatusList: ["en_instruction"] },
    ];

    private static mapSchema<T>(
        entity: DemarchesSimplifieesDataEntity,
        mapper: DemarchesSimplifieesMapperEntity,
        schemaId: string,
    ): T {
        const subvention = { siret: entity.siret };

        mapper[schemaId].forEach(property => {
            if (property.value) return lodash.set(subvention, property.to, property.value);

            let value = lodash.get(entity, property.from);
            const valueDate = [
                moment(value, "DD MMMM YYYY", "fr", true).toDate(), // Use moment for read French date
                moment(value, true), // use moment with strict params true, to force the reading of a date in js format and not an interpretation
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

    static toSubvention(
        entity: DemarchesSimplifieesDataEntity,
        mapper: DemarchesSimplifieesMapperEntity,
    ): DemandeSubvention {
        const toPv = ProviderValueFactory.buildProviderValueAdapter(
            demarchesSimplifieesService.provider.name,
            new Date(entity.demande.dateDerniereModification),
        );

        const subvention: DefaultObject = DemarchesSimplifieesEntityAdapter.mapSchema(entity, mapper, "schema");

        if (!subvention.annee_demande) {
            if (subvention.exercice && isNumberValid(Number(subvention.exercice)))
                subvention.annee_demande = subvention.exercice;
            // DS doesn't always have an attribute with only year, so we get year from the start date
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
        mapper: DemarchesSimplifieesMapperEntity,
    ): DemarchesSimplifieesRawGrant {
        const joinKey = demarchesSimplifieesService.getJoinKey({ entity, schema: mapper });

        return {
            provider: demarchesSimplifieesService.provider.id,
            type: "application",
            data: { entity, schema: mapper },
            joinKey,
        };
    }

    static toCommon(
        entity: DemarchesSimplifieesDataEntity,
        mapper: DemarchesSimplifieesMapperEntity,
    ): CommonApplicationDto {
        const application: DefaultObject = DemarchesSimplifieesEntityAdapter.mapSchema(entity, mapper, "commonSchema");

        if (!application.exercice && application.dateTransmitted)
            application.exercice = new Date(application.dateTransmitted as string)?.getFullYear();
        delete application.dateTransmitted;

        application.statut = toStatusFactory(DemarchesSimplifieesEntityAdapter._statusConversionArray)(
            application.providerStatus as string,
        );

        delete application.providerStatus;

        return application as unknown as CommonApplicationDto;
    }
}
