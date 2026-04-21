import { SireneStockUniteLegalePort } from "../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.port";
import Siren from "../../../identifier-objects/Siren";
import Siret from "../../../identifier-objects/Siret";

export default class FindSiretFromSirenUseCase {
    constructor(private sirenePort: SireneStockUniteLegalePort) {}

    async execute(siren: Siren) {
        const nic = (await this.sirenePort.findOneBySiren(siren))?.nicSiegeUniteLegale;
        if (nic && Siret.isNic(nic)) return siren.toSiret(nic);
        else return null;
    }
}
