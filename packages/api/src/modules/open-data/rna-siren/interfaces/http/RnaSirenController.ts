import { Route, Get, Controller, Tags, Response } from 'tsoa';
import { siretToSiren } from '../../../../../shared/helpers/SirenHelper';
import rnaSirenService from '../../rnaSiren.service';
import { Rna, Siren, RnaSirenResponseDto, GetRnaSirenErrorResponse } from "@api-subventions-asso/dto";
import { StructureIdentifiers } from "../../../../../@types";


@Route("open-data/rna-siren")
@Tags("Open Data")
export class RnaSirenController extends Controller {

    /**
     * Permet de récupérer le numéro RNA et le numéro Siren d'une association via l'un des deux (Rna ou Siren)
     * 
     * @summary Permet de récupérer le numéro RNA et le numéro Siren d'une association via l'un des deux (Rna ou Siren)
     * @param rna_or_siren_or_siret Peut-être soit le Rna, soit le Siren d'une association ou bien le Siret d'un établissement
     */
    @Get("{rna_or_siren_or_siret}")
    @Response<GetRnaSirenErrorResponse>(404, "Nous n'avons pas réussi à trouver une correspondance RNA-Siren", { success: false, rna: null, siren: null })
    public async findBySiret(
        rna_or_siren_or_siret: StructureIdentifiers,
    ): Promise<RnaSirenResponseDto> {
        let siren: null | Siren = null;
        let rna: null | Rna = null;

        if (rna_or_siren_or_siret.startsWith("W")) {
            rna = rna_or_siren_or_siret;
            siren = await rnaSirenService.getSiren(rna_or_siren_or_siret);
        } else {
            rna = await rnaSirenService.getRna(rna_or_siren_or_siret);
            siren = siretToSiren(rna_or_siren_or_siret);
        }

        const match = !!(siren && rna);

        if (!match) {
            this.setStatus(404)
            return {
                siren,
                rna,
                success: false
            }
        } else {
            return {
                siren: siren as Siren,
                rna: rna as Rna,
                success: true
            }
        }
    }
}
