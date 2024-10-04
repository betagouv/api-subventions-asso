import Rna from "../valueObjects/Rna";
import Siren from "../valueObjects/Siren";

export default class RnaSirenEntity {
    constructor(public rna: Rna, public siren: Siren, public id?: string) {}
}
