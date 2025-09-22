import { Route, Get, Controller, Tags, Response } from "tsoa";
import { RnaSirenResponseDto, GetRnaSirenErrorResponse } from "dto";
import rnaSirenService from "../../modules/rna-siren/rnaSiren.service";
import Siren from "../../identifierObjects/Siren";
import Rna from "../../identifierObjects/Rna";
import Siret from "../../identifierObjects/Siret";

@Route("open-data/rna-siren")
@Tags("Open Data")
export class RnaSirenHttp extends Controller {
    /**
     * Permet de récupérer le numéro RNA et le numéro Siren d'une association via un autre identifiant d'association
     *
     * @summary Permet de récupérer le numéro RNA et le numéro Siren d'une association via un autre identifiant d'association
     * @param rna_ou_siren_ou_siret Peut-être soit le Rna, soit le Siren d'une association, soit le Siret d'un établissement
     */
    @Get("/{rna_ou_siren_ou_siret}")
    @Response<GetRnaSirenErrorResponse>(404, "Nous n'avons pas réussi à trouver une correspondance RNA-Siren")
    public async findBySiret(rna_ou_siren_ou_siret: string): Promise<RnaSirenResponseDto[]> {
        const identifier = Siret.isStartOfSiret(rna_ou_siren_ou_siret)
            ? new Siren(rna_ou_siren_ou_siret.slice(0, 9))
            : Rna.isRna(rna_ou_siren_ou_siret)
              ? new Rna(rna_ou_siren_ou_siret)
              : new Siren(rna_ou_siren_ou_siret);
        const entities = await rnaSirenService.find(identifier);

        if (!entities) return [];

        return entities.map(entity => ({
            // Todo : use adapter
            siren: entity.siren.value,
            rna: entity.rna.value,
        }));
    }
}
