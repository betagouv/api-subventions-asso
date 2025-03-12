import { UniteLegalHistoryRow } from "../@types";
import UniteLegalNameEntity from "../../../../../entities/UniteLegalNameEntity";
import { UniteLegalEntrepriseEntity } from "../../../../../entities/UniteLegalEntrepriseEntity";
import Siren from "../../../../../valueObjects/Siren";

export class UniteLegaleHistoriqueAdapter {
    static rowToUniteLegalNameEntity(row: UniteLegalHistoryRow) {
        const siren = new Siren(row.siren);
        return new UniteLegalNameEntity(
            siren,
            row.denominationUniteLegale,
            this.buildSearchKey(siren, row.denominationUniteLegale),
            new Date(row.dateDebut),
        );
    }

    public static buildSearchKey(siren: Siren, name: string) {
        const nameLc = name.toLowerCase();
        let key = `${siren.value} - ${nameLc}`;
        const removeAccents = str => str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Remove accent on name for futur search
        const nameWithoutAccent = removeAccents(nameLc);

        if (nameLc != nameWithoutAccent) {
            key += ` - ${nameWithoutAccent}`;
        }

        return key;
    }

    static rowToUniteLegalEntrepriseEntity(row: UniteLegalHistoryRow) {
        return new UniteLegalEntrepriseEntity(new Siren(row.siren));
    }
}
