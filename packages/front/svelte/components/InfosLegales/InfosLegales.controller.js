import { valueOrHyphen } from "../../helpers/dataHelper";
import { modal, data } from "../../store/modal.store";
import { getAddress } from "../../views/association/association.helper";
import MoreInfosLegalesModal from "./MoreInfosLegalesModal.svelte";

export default class InfosLegalesController {
    constructor(association) {
        this.association = association;
        this._modalData = this._buildModalData();
    }

    displayModal() {
        data.set(this._modalData);
        modal.set(MoreInfosLegalesModal);
    }

    _buildModalData() {
        const headers = ["Titre", "Informations provenant du RNA", "Informations provenant du SIREN"];
        const objectRaws = {
            Dénomination: [this.association.denomination_rna, this.association.denomination_siren],
            "Adresse du siège": [
                getAddress(this.association.adresse_siege_rna),
                getAddress(this.association.adresse_siege_siren)
            ],
            "Date d'immatriculation": [this.association.date_creation_rna, this.association.date_creation_siren],
            "Date de modification": [this.association.date_modification_rna, this.association.date_modification_siren]
        };
        const raws = Object.entries(objectRaws).map(([header, values]) => {
            return [header, ...values.map(value => valueOrHyphen(value))];
        });
        return {
            headers,
            raws
        };
    }
}
