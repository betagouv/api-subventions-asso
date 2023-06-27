import AssociationNameEntity from "../../../association-name/entities/AssociationNameEntity";
import { UniteLegalHistoryRow } from "../@types/UniteLegalHistoryRow";
import dataGouvService from "../datagouv.service";
import EntrepriseSirenEntity from "../entities/EntrepriseSirenEntity";

export class UniteLegaleHistoriqueAdapter {
    static rowToAssociationName(row: UniteLegalHistoryRow) {
        return new AssociationNameEntity(
            null,
            row.denominationUniteLegale,
            dataGouvService.provider.name,
            new Date(row.dateDebut),
            row.siren,
        );
    }

    static rowToEntrepriseSiren(row: UniteLegalHistoryRow) {
        return new EntrepriseSirenEntity(row.siren);
    }
}
