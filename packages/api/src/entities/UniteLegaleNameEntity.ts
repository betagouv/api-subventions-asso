import { Rna } from "../identifier-objects";
import Siren from "../identifier-objects/Siren";
import { removeAccents } from "../shared/helpers/StringHelper";

interface UniteLegaleNameProps {
    siren: Siren;
    name: string;
    rna: Rna | null;
    searchKey?: string;
    updateDate?: Date;
}

export default class UniteLegaleNameEntity {
    public siren: Siren;
    public rna: Rna | null;
    public name: string;
    public searchKey: string;
    public updateDate: Date;

    constructor(props: UniteLegaleNameProps) {
        this.siren = props.siren;
        this.rna = props.rna ?? null;
        this.name = props.name;
        this.searchKey = props.searchKey ? props.searchKey : this.buildSearchKey(this.siren, this.rna, this.name);
        this.updateDate = props.updateDate ? props.updateDate : new Date();
    }

    private buildSearchKey(siren: Siren, rna: Rna | null, name: string) {
        const nameLC = name.toLowerCase();
        let key = `${siren.value} - ${nameLC}`;

        const nameWithoutAccent = removeAccents(nameLC);
        if (nameLC != nameWithoutAccent) {
            key += ` - ${nameWithoutAccent}`;
        }

        if (rna) key += `- ${rna.value}`; // only rna can be null

        return key;
    }
}
