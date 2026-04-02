import Siren from "../identifier-objects/Siren";

export default class UniteLegaleNameEntity {
    constructor(
        public siren: Siren,
        public name: string,
        public searchKey: string,
        public updatedDate: Date,
        public id?: string,
    ) {}
}
