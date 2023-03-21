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
    static toSubvention(
        entity: DemarchesSimplifieesDataEntity,
        mapper: DemarchesSimplifieesMapperEntity
    ): DemandeSubvention {
        const toPv = ProviderValueFactory.buildProviderValueAdapter(
            demarchesSimplifieesService.provider.name,
            new Date(entity.demande.dateDerniereModification)
        );

        const subvention: DefaultObject<ProviderValue> = {
            siret: toPv(entity.siret)
        };

        mapper.schema.forEach(property => {
            let value = lodash.get(entity, property.from);
            const valueDate = [moment(value, "DD MMMM YYYY", "fr", true).toDate(), new Date(value)].find(date =>
                isValidDate(date)
            );

            if (value === undefined || value === "") return;
            else if (stringIsFloat(value)) value = parseFloat(value);
            else value = valueDate || value;

            lodash.set(subvention, property.to, toPv(value));
        });

        // DS doesn't have an attribute with only year, so we get year from the start date
        if (subvention.date_debut && subvention.date_debut.value && isValidDate(subvention.date_debut.value))
            subvention.annee_demande = toPv((subvention.date_debut.value as Date).getFullYear());

        return subvention as unknown as DemandeSubvention;
    }
}
