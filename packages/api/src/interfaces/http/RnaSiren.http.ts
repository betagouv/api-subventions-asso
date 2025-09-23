import { Route, Get, Controller, Tags, Response } from "tsoa";
import { RnaSirenResponseDto, GetRnaSirenErrorResponse } from "dto";
import rnaSirenService from "../../modules/rna-siren/rnaSiren.service";

@Route("open-data/rna-siren")
@Tags("Open Data")
export class RnaSirenHttp extends Controller {
    /**
     * Permet de récupérer le numéro RNA et le numéro Siren d'une association via un autre identifiant d'association
     *
     * @summary Permet de récupérer le numéro RNA et le numéro Siren d'une association via un autre identifiant d'association
     * @param identifier Peut-être soit le Rna, soit le Siren d'une association, soit le Siret d'un établissement
     */
    @Get("/{identifier}")
    @Response<GetRnaSirenErrorResponse>(404, "Nous n'avons pas réussi à trouver une correspondance RNA-Siren")
    public async findByIdentifier(identifier: string): Promise<RnaSirenResponseDto[]> {
        const entities = await rnaSirenService.find(identifier);

        if (!entities) return [];

        return entities.map(entity => ({
            // Todo : use adapter
            siren: entity.siren.value,
            rna: entity.rna.value,
        }));
    }
}
