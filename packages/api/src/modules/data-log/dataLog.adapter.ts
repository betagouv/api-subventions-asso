import { DataLogDto } from "dto";
import { DataLogEntity } from "./entities/dataLogEntity";

export class DataLogAdapter {
    static entityToDto(log: DataLogEntity): DataLogDto {
        return {
            derniere_date_edition: log.editionDate,
            derniere_date_integration: log.integrationDate,
            premiere_date_integration: new Date(1), // TODO
            identifiant_fournisseur: log.providerId,
        };
    }
}
