import type { SiretDto } from "dto";
import MoreInfosLegalesModal from "./MoreInfosLegalesModal.svelte";
import {
    getAddress,
    addressToOneLineString,
    getImmatriculation,
    getModification,
    getSiegeSiret,
} from "$lib/resources/associations/association.helper";
import type { BadgeOption } from "$lib/dsfr/Badge.types";
import { getStatusBadgeOptions } from "$lib/resources/establishments/establishment.helper";
import { modal, data } from "$lib/store/modal.store";
import { valueOrHyphen } from "$lib/helpers/dataHelper";
import { dateToDDMMYYYY } from "$lib/helpers/dateHelper";

export default class InfosLegalesController {
    public estabStatusBadgeOptions: Partial<BadgeOption> | null = null;
    private _immatriculation: string;
    private _modification: string;
    private _modalData = {};

    // TODO: create EstablishmentEntity / FlatenProviderValueEstablishment | linked to #2078
    constructor(
        public association,
        public establishment: { siret: SiretDto; adresse: unknown } | undefined = undefined,
    ) {
        this.association = { ...association };
        this.establishment = establishment ? { ...establishment } : undefined;
        this._immatriculation = getImmatriculation(this.association);
        this._modification = getModification(this.association);
        this._modalData = this._buildModalData();

        if (this.establishment) this._performEstabTasks();
    }

    get objetSocial() {
        return valueOrHyphen(this.association.objet_social);
    }

    get siret() {
        let title, value;
        if (this.establishment) {
            title = "SIRET établissement";
            value = this.establishment.siret;
        } else {
            const siretSiege = getSiegeSiret(this.association);
            title = "SIRET du siège";
            value = isNaN(siretSiege) ? "-" : siretSiege;
        }
        return { title, value };
    }

    get nic() {
        if (this.establishment) {
            const siret = this.establishment.siret;
            return siret.substring(9);
        } else return null;
    }

    get address() {
        let title, value;
        if (this.establishment) {
            title = "Adresse établissement";
            value = addressToOneLineString(this.establishment.adresse);
        } else {
            title = "Adresse du siège";
            value = valueOrHyphen(addressToOneLineString(getAddress(this.association)));
        }
        return { title, value };
    }

    get immatriculation() {
        return dateToDDMMYYYY(this._immatriculation);
    }

    get modification() {
        return dateToDDMMYYYY(this._modification);
    }

    displayModal() {
        data.set(this._modalData);
        modal.set(MoreInfosLegalesModal);
    }

    _performEstabTasks() {
        this.estabStatusBadgeOptions = getStatusBadgeOptions(this.establishment);
    }

    _buildModalData() {
        const headers = ["Titre", "Informations provenant du RNA", "Informations provenant du SIREN"];
        const objectRows = {
            Dénomination: [this.association.denomination_rna, this.association.denomination_siren],
            "Adresse du siège": [
                addressToOneLineString(this.association.adresse_siege_rna),
                addressToOneLineString(this.association.adresse_siege_siren),
            ],
            "Date d'immatriculation": [
                this.association.date_creation_rna ? dateToDDMMYYYY(this.association.date_creation_rna) : null,
                this.association.date_creation_siren ? dateToDDMMYYYY(this.association.date_creation_siren) : null,
            ],
            "Date de modification": [
                this.association.date_modification_rna ? dateToDDMMYYYY(this.association.date_modification_rna) : null,
                this.association.date_modification_siren
                    ? dateToDDMMYYYY(this.association.date_modification_siren)
                    : null,
            ],
        };
        const rows = Object.entries(objectRows).map(([header, values]) => {
            return [header, ...values.map(value => valueOrHyphen(value))];
        });
        return {
            headers,
            rows,
        };
    }
}
