import rnaSirenAdapter from "../../../adapters/outputs/db/rna-siren/rna-siren.adapter";
import { RnaSirenPort } from "../../../adapters/outputs/db/rna-siren/rna-siren.port";
import { SireneUniteLegalePort } from "../../../adapters/outputs/db/sirene/sirene-unite-legale.port";
import sireneUniteLegaleAdapter from "../../../adapters/outputs/db/sirene/sirene-unite-legale.adapter";
import Rna from "../../../identifier-objects/Rna";

export class FindSiretFromRnaUseCase {
    constructor(
        private rnaSirenPort: RnaSirenPort,
        private sirenePort: SireneUniteLegalePort,
    ) {}

    async execute(rna: Rna) {
        const rnaSirenResult = await this.rnaSirenPort.find(rna);
        if (rnaSirenResult) {
            const siren = rnaSirenResult[0].siren;
            const uniteLegale = await this.sirenePort.findOneBySiren(siren);
            const nic = uniteLegale?.nicSiegeUniteLegale;
            if (nic) {
                const siret = siren.toSiret(nic);
                return siret;
            } else return null;
        } else {
            const uniteLegale = await this.sirenePort.findOneByRna(rna);
            const siren = uniteLegale?.siren;
            const nic = uniteLegale?.nicSiegeUniteLegale;
            if (siren && nic) {
                const siret = siren.toSiret(nic);
                return siret;
            } else return null;
        }
    }
}

const findSiretFromRna = new FindSiretFromRnaUseCase(rnaSirenAdapter, sireneUniteLegaleAdapter);
export default findSiretFromRna;
