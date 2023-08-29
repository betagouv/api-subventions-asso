import { Route, Get, Controller, Tags, Response } from "tsoa";
import { Rna, Siren, RnaSirenResponseDto, GetRnaSirenErrorResponse } from "dto";
import { siretToSiren } from "../../../../../shared/helpers/SirenHelper";
import rnaSirenService from "../../rnaSiren.service";
import { StructureIdentifiers } from "../../../../../@types";

@Route("open-data/rna-siren")
@Tags("Open Data")
export class RnaSirenController extends Controller {
    /**
     * Permet de récupérer le numéro RNA et le numéro Siren d'une association via un autre identifiant d'association
     *
     * @summary Permet de récupérer le numéro RNA et le numéro Siren d'une association via un autre identifiant d'association
     * @param rna_ou_siren_ou_siret Peut-être soit le Rna, soit le Siren d'une association, soit le Siret d'un établissement
     */
    @Get("{rna_ou_siren_ou_siret}")
    @Response<GetRnaSirenErrorResponse>(404, "Nous n'avons pas réussi à trouver une correspondance RNA-Siren", {
        rna: null,
        siren: null,
    })
    public async findBySiret(rna_ou_siren_ou_siret: StructureIdentifiers): Promise<RnaSirenResponseDto> {
        const identifier = rna_ou_siren_ou_siret;
        let siren: null | Siren = null;
        let rna: null | Rna = null;

        if (identifier.startsWith("W")) {
            rna = identifier;
            siren = await rnaSirenService.getSiren(identifier);
        } else {
            rna = await rnaSirenService.getRna(identifier);
            siren = siretToSiren(identifier);
        }

        const match = !!(siren && rna);

        if (!match) {
            this.setStatus(404);
            return { siren, rna };
        } else {
            return {
                siren: siren as Siren,
                rna: rna as Rna,
            };
        }
    }
}
