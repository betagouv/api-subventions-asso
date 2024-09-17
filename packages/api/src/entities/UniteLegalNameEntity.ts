import { Siren } from "dto";

export default class UniteLegalNameEntity {
    constructor(
        public siren: Siren,
        public name: string,
        public searchKey: string,
        public updatedDate: Date,
        public legalCategory: string,
        public id?: string,
    ) {}
}
