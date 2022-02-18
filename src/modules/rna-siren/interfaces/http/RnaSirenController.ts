import { Route, Get, Controller, Tags, Response } from 'tsoa';
import { Rna } from '../../../../@types/Rna';
import { Siren } from '../../../../@types/Siren';
import { Siret } from '../../../../@types/Siret';
import { siretToSiren } from '../../../../shared/helpers/SirenHelper';
import rnaSirenService from '../../rnaSiren.service';


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
    @Response(404, "Nous n'avons pas réussi à trouver une correspondance RNA-Siren", { success: false, rna: null, siren: null })
    public async findBySiret(
        rna_or_siren_or_siret: Siret | Rna | Siren,
    ): Promise<{ success: boolean, siren: Siren | null, rna: Rna | null}>{
        let siren: null | Siren = null;
        let rna: null | Rna = null;

        if (rna_or_siren_or_siret.startsWith("W")) {
            rna = rna_or_siren_or_siret;
            siren = await rnaSirenService.getSiren(rna_or_siren_or_siret);
        } else {
            rna = await rnaSirenService.getRna(rna_or_siren_or_siret);
            siren = siretToSiren(rna_or_siren_or_siret);
        }

        const success =  !!(siren && rna);

        if (!success) this.setStatus(404);

        return {
            siren,
            rna,
            success
        }
    }

}
