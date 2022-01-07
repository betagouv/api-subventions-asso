import { ObjectId } from "mongodb";

export default class OsirisActionEntity {
    public static defaultMainCategory = "Dossier/action";

    public static indexedInformationsPath = {
        osirisActionId: ["Dossier/action", "Numero Action Osiris"],
        compteAssoId: ["Dossier/action", "N° Dossier Compte Asso"],
    }

    constructor(
        public indexedInformations: {
            osirisActionId: string,
            compteAssoId: string
        },
        public data: unknown,
        public _id?: ObjectId
    ) {}
}