import { DataLogDto } from "dto";
import { DataLogEntity } from "./entities/dataLogEntity";

export class DataLogAdapter {
    static entityToDto(log: DataLogEntity): DataLogDto {
        return {
            date_edition: log.editionDate,
            date_integration: log.integrationDate,
            identifiant_fournisseur: log.providerId,
        };
    }
}
