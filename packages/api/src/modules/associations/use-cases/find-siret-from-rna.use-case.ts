import { RnaSirenPort } from "../../../adapters/outputs/db/rna-siren/rna-siren.port";
import { SireneStockUniteLegalePort } from "../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.port";
import Rna from "../../../identifier-objects/Rna";

export default class FindSiretFromRnaUseCase {
    constructor(
        private rnaSirenPort: RnaSirenPort,
        private sirenePort: SireneStockUniteLegalePort,
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
