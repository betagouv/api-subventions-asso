import moment from "moment";
import * as lodash from "lodash";
import { DemandeSubvention, ProviderValue } from "@api-subventions-asso/dto";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import demarchesSimplifieesService from "../demarchesSimplifiees.service";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesMapperEntity from "../entities/DemarchesSimplifieesMapperEntity";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { DefaultObject } from "../../../../@types";
import { stringIsFloat } from "../../../../shared/helpers/StringHelper";

export class DemarchesSimplifieesEntityAdapter {
    private static mapSchema<T>(
        entity: DemarchesSimplifieesDataEntity,
        mapper: DemarchesSimplifieesMapperEntity,
        schemaId: string,
    ): T {
        const subvention = { siret: entity.siret };

        mapper[schemaId].forEach(property => {
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

    static toSubvention(
        entity: DemarchesSimplifieesDataEntity,
        mapper: DemarchesSimplifieesMapperEntity,
    ): DemandeSubvention {
        const toPv = ProviderValueFactory.buildProviderValueAdapter(
            demarchesSimplifieesService.provider.name,
            new Date(entity.demande.dateDerniereModification),
        );

        const subvention: DefaultObject = DemarchesSimplifieesEntityAdapter.mapSchema(entity, mapper, "schema");

        // DS doesn't have an attribute with only year, so we get year from the start date
        if (subvention.date_debut && subvention.date_debut && isValidDate(subvention.date_debut))
            subvention.annee_demande = (subvention.date_debut as Date).getFullYear();

        Object.keys(subvention).map(key => (subvention[key] = toPv(subvention[key])));

        return subvention as unknown as DemandeSubvention;
    }
}
