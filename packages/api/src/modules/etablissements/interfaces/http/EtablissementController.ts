import {
    DemandeSubvention,
    GetDocumentsResponseDto,
    GetEtablissementResponseDto,
    GetSubventionsResponseDto,
    GetVersementsResponseDto,
    Siret,
} from "@api-subventions-asso/dto";
import { Route, Get, Controller, Tags, Security, Response } from "tsoa";
import etablissementService from "../../etablissements.service";
import { ErrorResponse } from "@api-subventions-asso/dto/shared/ResponseStatus";
import { NotFoundError } from "../../../../shared/errors/httpErrors/NotFoundError";
import { StructureIdentifiersEnum } from "../../../../@enums/StructureIdentifiersEnum";
import { BadRequestError } from "../../../../shared/errors/httpErrors/BadRequestError";
import * as IdentifierHelper from "../../../../shared/helpers/IdentifierHelper";

@Route("etablissement")
@Security("jwt")
@Tags("Etablissement Controller")
export class EtablissementController extends Controller {
  /**
   * Remonte les informations d'un établissement
   * @param siret Identifiant Siret
   */
  @Get("/{siret}")
  @Response<ErrorResponse>("400", "Identifiant incorrect", {
      success: false,
      message: "You must provide a valid SIRET",
  })
  @Response<ErrorResponse>("404", "L'établissement n'a pas été trouvé", {
      success: false,
      message: "Etablissement not found",
  })
    public async getEtablissement(
        siret: Siret
    ): Promise<GetEtablissementResponseDto> {
        const type = IdentifierHelper.getIdentifierType(siret);

        if (!type || type !== StructureIdentifiersEnum.siret) {
            throw new BadRequestError("You must provide a valid SIRET");
        }
        const etablissement = await etablissementService.getEtablissement(siret);

        if (!etablissement) {
            throw new NotFoundError("Etablissement not found");
        }
        return { success: true, etablissement };
    }

  /**
   * Recherche les demandes de subventions liées à un établisement
   *
   * @summary Recherche les demandes de subventions liées à un établisement
   * @param siret Identifiant Siret
   */
  @Get("/{siret}/subventions")
  @Response<ErrorResponse>("404")
  public async getDemandeSubventions(
      siret: Siret
  ): Promise<GetSubventionsResponseDto> {
      const data = await etablissementService.getSubventions(siret).toPromise();
      const subventions = data
          .map((subFlux) => subFlux.subventions)
          .flat()
          .filter((subvention) => subvention) as DemandeSubvention[];

      return { success: true, subventions };
  }

  /**
   * Recherche les versements liées à un établisement
   *
   * @summary Recherche les versements liées à un établisement
   * @param siret Identifiant Siret
   */
  @Get("/{siret}/versements")
  @Response<ErrorResponse>("404")
  public async getVersements(siret: Siret): Promise<GetVersementsResponseDto> {
      try {
          const versements = await etablissementService.getVersements(siret);
          return { success: true, versements };
      } catch (e: unknown) {
          this.setStatus(404);
          return { success: false, message: (e as Error).message };
      }
  }

  /**
   * Recherche les documents liées à un établisement
   *
   * @summary Recherche les documents liées à un établisement
   * @param siret Identifiant Siret
   */
  @Get("/{siret}/documents")
  @Response<ErrorResponse>("404")
  public async getDocuments(siret: Siret): Promise<GetDocumentsResponseDto> {
      try {
          const documents = await etablissementService.getDocuments(siret);
          return { success: true, documents };
      } catch (e: unknown) {
          this.setStatus(404);
          return { success: false, message: (e as Error).message };
      }
  }
}
