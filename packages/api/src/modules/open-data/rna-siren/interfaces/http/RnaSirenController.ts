import { Route, Get, Controller, Tags } from "tsoa";
import { RnaSirenResponseDto } from "@api-subventions-asso/dto";
import rnaSirenService from "../../rnaSiren.service";
import { StructureIdentifiers } from "../../../../../@types";

@Route("open-data/rna-siren")
@Tags("Open Data")
export class RnaSirenController extends Controller {
    /**
     * Permet de récupérer le numéro RNA et le numéro Siren d'une association via l'un des deux (Rna ou Siren)
     *
     * @summary Permet de récupérer le numéro RNA et le numéro Siren d'une association via l'un des deux (Rna ou Siren)
     * @param identifier Peut-être soit le Rna, soit le Siren d'une association ou bien le Siret d'un établissement
     */
    @Get("{identifier}")
    public async findBySiret(identifier: StructureIdentifiers): Promise<RnaSirenResponseDto> {
        return rnaSirenService.findMatch(identifier);
    }
}
