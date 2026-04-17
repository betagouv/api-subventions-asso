import { SireneStockUniteLegalePort } from "../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.port";
import Rna from "../../../identifier-objects/Rna";
import Siret from "../../../identifier-objects/Siret";

export default class FindSiretFromRnaUseCase {
    constructor(private sirenePort: SireneStockUniteLegalePort) {}

    async execute(rna: Rna) {
        const uniteLegale = await this.sirenePort.findOneByRna(rna);
        if (!uniteLegale) return uniteLegale;
        const siren = uniteLegale.siren;
        const nic = uniteLegale.nicSiegeUniteLegale;
        if (siren && nic && Siret.isNic(nic)) {
            const siret = siren.toSiret(nic);
            return siret;
        } else return null;
    }
}
