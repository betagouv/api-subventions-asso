import Siren from "../identifierObjects/Siren";

export default class UniteLegalNameEntity {
    constructor(
        public siren: Siren,
        public name: string,
        public searchKey: string,
        public updatedDate: Date,
        public id?: string,
    ) {}
}
