import { Siren } from "dto";

export default class UniteLegalNameEntity {
    constructor(
        public siren: Siren,
        public name: string,
        public searchingKey: string,
        public updatedDate: Date,
        public id ?: string
    ) {}
}