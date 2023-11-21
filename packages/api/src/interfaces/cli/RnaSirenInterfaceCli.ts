import { Rna, Siren } from "dto";
import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import { isRna, isSiren } from "../../shared/Validators";
import rnaSirenService from "../../modules/rna-siren/rnaSiren.service";
import rnaSirenPort from "../../dataProviders/db/rnaSiren/rnaSiren.port";

@StaticImplements<CliStaticInterface>()
export default class RnaSirenInterfaceCli {
    static cmdName = "rnaSiren";

    public async addRnaSirenMatch(rna: Rna, siren: Siren) {
        if (! isRna(rna) || !isSiren(siren)) {
            throw new Error("RNA or SIREN is Invalid");
        }

        await rnaSirenService.insert(rna, siren);
    }

    public async indexes() {
        await rnaSirenPort.createIndexes()
    }
}