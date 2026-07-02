import sireneUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import { SireneUniteLegalePort } from "../../../adapters/outputs/db/sirene/sirene-unite-legale.port";
import Siren from "../../../identifier-objects/Siren";
import Siret from "../../../identifier-objects/Siret";

export class FindSiretFromSirenUseCase {
    constructor(private sirenePort: SireneUniteLegalePort) {}

    async execute(siren: Siren) {
        const nic = (await this.sirenePort.findOneBySiren(siren))?.nicSiegeUniteLegale;
        if (nic && Siret.isNic(nic)) return siren.toSiret(nic);
        else return null;
    }
}

const findSiretFromSiren = new FindSiretFromSirenUseCase(sireneUniteLegaleAdapter);
export default findSiretFromSiren;
