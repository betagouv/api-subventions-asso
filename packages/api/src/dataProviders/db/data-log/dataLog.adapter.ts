import { DataLogDto } from "dto";
import { ProducerLogEntity } from "../../../modules/data-log/entities/producerLogEntity";

export class DataLogAdapter {
    // do we want this here ?
    static overviewToDto(overview: ProducerLogEntity): DataLogDto {
        return {
            identifiant_fournisseur: overview.providerId,
            premiere_date_integration: overview.firstIntegrationDate,
            derniere_date_integration: overview.lastIntegrationDate,
            derniere_date_edition: overview.lastCoverDate,
        };
    }
}
