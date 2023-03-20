import * as lodash from "lodash";
import { DemandeSubvention, ProviderValue } from "@api-subventions-asso/dto";
import { isString } from "lodash";
import ProviderValueFactory from "../../../../shared/ProviderValueFactory";
import demarchesSimplifieesService from "../demarchesSimplifiees.service";
import DemarchesSimplifieesDataEntity from "../entities/DemarchesSimplifieesDataEntity";
import DemarchesSimplifieesMapperEntity from "../entities/DemarchesSimplifieesMapperEntity";
import { isValidDate } from "../../../../shared/helpers/DateHelper";
import { DefaultObject } from "../../../../@types";

export class DemarchesSimplifieesEntityAdapter {
    static toSubvention(
        entity: DemarchesSimplifieesDataEntity,
        mapper: DemarchesSimplifieesMapperEntity
    ): DemandeSubvention {
        // Used for decembre month (décembre to decembre)
        const cleanDate = dateString => new Date(dateString.replace("é", "e"));
        const toPv = ProviderValueFactory.buildProviderValueAdapter(
            demarchesSimplifieesService.provider.name,
            new Date(entity.demande.dateDerniereModification)
        );

        const subvention: DefaultObject<ProviderValue> = {
            siret: toPv(entity.siret)
        };

        mapper.schema.forEach(property => {
            let value = lodash.get(entity, property.from);
            const valueDate = new Date(cleanDate(value));
            const valueNumber = parseFloat(value);

            if (value === undefined || value === "") return;
            else if (isValidDate(valueDate)) value = valueDate;
            else if (!isNaN(valueNumber)) value = valueNumber;

            lodash.set(subvention, property.to, toPv(value));
        });

        // Manual assign because not only one year
        if (subvention.date_debut) subvention.annee_demande = toPv((subvention.date_debut.value as Date).getFullYear());

        return subvention as unknown as DemandeSubvention;
    }
}
