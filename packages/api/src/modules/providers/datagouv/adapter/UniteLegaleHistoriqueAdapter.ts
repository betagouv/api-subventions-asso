import AssociationNameEntity from "../../../association-name/entities/AssociationNameEntity";
import { UniteLegalHistoryRaw } from "../@types/UniteLegalHistoryRaw";
import dataGouvService from "../datagouv.service";
import EntrepriseSirenEntity from "../entities/EntrepriseSirenEntity";

export class UniteLegaleHistoriqueAdapter {
    static rawToAssociationName(raw: UniteLegalHistoryRaw) {
        return new AssociationNameEntity(
            null,
            raw.denominationUniteLegale,
            dataGouvService.provider.name,
            new Date(raw.dateDebut),
            raw.siren,
        );
    }

    static rawToEntrepriseSiren(raw: UniteLegalHistoryRaw) {
        return new EntrepriseSirenEntity(raw.siren);
    }
}
