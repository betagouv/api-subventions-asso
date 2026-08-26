import { Address } from "../../../@types/Address";
import { Siret } from "../../../identifier-objects";

export interface EstablishmentProps {
    siret: string;
    siege: boolean;
    address: Address;
    lastUpdate: Date;
}

export class EstablishmentEntity {
    public siret: Siret;
    public siege: boolean;
    public address: Address;
    public lastUpdate: Date;

    constructor(props: EstablishmentProps) {
        this.siret = new Siret(props.siret);
        this.siege = props.siege;
        this.address = props.address;
        this.lastUpdate = props.lastUpdate;
    }
}
