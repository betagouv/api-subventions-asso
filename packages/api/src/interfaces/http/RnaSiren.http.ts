import { Route, Get, Controller, Tags, Path, SuccessResponse, Response, Example } from "tsoa";
import { RnaSirenResponseDto } from "dto";
import { PathParamError } from "core";
import { IdentifierError } from "../../modules/association-identifier/IdentifierError";
import rnaSirenService from "../../modules/rna-siren/rna-siren.service";

@Route("open-data/rna-siren")
@Tags("Open Data")
export class RnaSirenHttp extends Controller {
    /**
     * @summary Permet de récupérer le numéro RNA et le numéro SIREN d'une association via un autre identifiant d'association
     * @param identifier Soit le RNA ou le SIREN d'une association, soit le SIRET d'un établissement
     * @example identifier "W123004567"
     */
    @Example<RnaSirenResponseDto[]>([
        {
            siren: "123456789",
            rna: "W123004567",
        },
    ])
    @Get("/{identifier}")
    @SuccessResponse(200)
    @Response(204, "No Content")
    @Response<IdentifierError>(422, "Invalid Query String")
    public async findByIdentifier(@Path() identifier: string): Promise<RnaSirenResponseDto[] | null> {
        let entities;

        try {
            entities = await rnaSirenService.findFromUnknownIdentifier(identifier);
        } catch (e) {
            if (e instanceof IdentifierError) {
                throw new PathParamError("identifier must be valid RNA, SIREN or SIRET", {
                    value: identifier,
                });
            } else throw e;
        }

        if (!entities) {
            this.setStatus(204);
            return null;
        }

        return entities.map(entity => ({
            siren: entity.siren.value,
            rna: entity.rna.value,
        }));
    }
}
