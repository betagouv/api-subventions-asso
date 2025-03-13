import Siren from "../../../../../valueObjects/Siren";

export class UniteLegaleHistoriqueAdapter {
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
}
