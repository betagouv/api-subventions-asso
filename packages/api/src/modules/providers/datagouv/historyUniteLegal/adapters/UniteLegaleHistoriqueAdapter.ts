import { Siren } from "dto";
import { UniteLegalHistoryRow } from "../@types/UniteLegalHistoryRow";
import UniteLegalNameEntity from "../../../../../entities/UniteLegalNameEntity";
import { UniteLegalEntrepriseEntity } from "../../../../../entities/UniteLegalEntrepriseEntity";

export class UniteLegaleHistoriqueAdapter {
    static rowToUniteLegalNameEntity(row: UniteLegalHistoryRow) {
        return new UniteLegalNameEntity(
            row.siren,
            row.denominationUniteLegale,
            this.buildSearchingKey(row.siren, row.denominationUniteLegale),
            new Date(row.dateDebut),
        );
    }

    private static buildSearchingKey(siren: Siren, name: string) {
        const nameLc = name.toLowerCase();
        let key =  `${siren} - ${nameLc}`;
        const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        const nameWithoutAccent = removeAccents(nameLc);

        if (nameLc != nameWithoutAccent) {
            key += ` - ${nameWithoutAccent}`;
        }

        return key
    }

    static rowToUniteLegalEntrepriseEntity(row: UniteLegalHistoryRow) {
        return new UniteLegalEntrepriseEntity(row.siren);
    }
}
