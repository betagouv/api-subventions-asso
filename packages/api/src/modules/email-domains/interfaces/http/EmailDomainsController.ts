import { AddEmailDomainDto, ErrorResponse } from "@api-subventions-asso/dto";
import { Controller, Post, Route, Security, Tags, Response, Body, SuccessResponse } from "tsoa";
import emailDomainsService from "../../emailDomains.service";

@Route("/domain")
@Security("jwt", ["admin"])
@Tags("EmailDomain Controller")
export class EmailDomainsController extends Controller {
    /**
     *
     *
     * @summary Ajoute un nom de domaine d'adresse e-mail
     * @param domain String nom du domaine (ex @rhones.fr ou rhones.fr)
     * @returns {EmailDomainsResponse}
     */
    @Post()
    @SuccessResponse("201", "Created")
    @Response<ErrorResponse>(500, "Internal Server Error", {
        success: false,
        message: "Internal Server Error"
    })
    public async addDomain(@Body() body: { domain: string }): Promise<AddEmailDomainDto> {
        try {
            const persistedDomain = await emailDomainsService.add(body.domain);
            this.setStatus(201);
            return { success: true, domain: persistedDomain };
        } catch (e) {
            this.setStatus(500);
            return { success: false, message: "Internal Server Error" };
        }
    }
}

// import { ErrorResponse } from "@api-subventions-asso/dto/shared/ResponseStatus";
// import { Route, Post, Controller, Tags, Security, Response } from 'tsoa';

// @Route("domain")
// @Security("jwt", ["admin"])
// @Tags("EmailDomain Controller")
// export class AssociationController extends Controller {
//     /**
//      * Remonte les informations d'une association
//      * @param identifier Siret, Siren ou Rna
//      */
//     @Post("/test")
//     @Response<ErrorResponse>("404")
//     public async getAssociation(): Promise<GetAssociationResponseDto> {
//         try {
//             const association = await associationService.getAssociation(identifier);
//             if (association) return { success: true, association };
//             this.setStatus(404);
//             return { success: false, message: "Association not found" };
//         } catch (e: unknown) {
//             this.setStatus(404);
//             return { success: false, message: (e as Error).message }
//         }
//     }
// }
