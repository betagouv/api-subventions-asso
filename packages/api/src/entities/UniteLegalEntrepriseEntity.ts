import Siren from "../valueObjects/Siren";

export class UniteLegalEntrepriseEntity {
    constructor(
        public siren: Siren,
        public id?: string,
    ) {}
}
