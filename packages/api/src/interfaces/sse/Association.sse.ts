import express from "express";
import associationService from "../../modules/associations/associations.service";
import ControllerSSE from "../../decorators/controllerSSE.decorator";
import { Get } from "../../decorators/sse.methods.decorator";
import SSEResponse from "../../sse/@types/SSEResponse";
import associationIdentifierService from "../../modules/association-identifier/association-identifier.service";

@ControllerSSE("/sse/association", {
    security: "jwt",
})
export class AssociationSse {
    /**
     * Recherche les demandes de subventions liées à une association
     *
     * @summary Recherche les demandes de subventions liées à une association
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/:identifier/subventions")
    public async getDemandeSubventions(req: express.Request, res: SSEResponse) {
        try {
            const associationIdentifiers = await associationIdentifierService.getOneAssociationIdentifier(
                req.params.identifier,
            );

            const flux = await associationService.getSubventions(associationIdentifiers);

            if (!flux) {
                res.sendSSEData({ event: "close" });
                return;
            }

            flux.on("data", data => {
                res.sendSSEData(data);
            });

            flux.on("close", () => {
                res.sendSSEData({ event: "close" });
            });
        } catch (e) {
            res.sendSSEError({ message: (e as Error).message });
            res.sendSSEData({ event: "close" });
        }
    }
}
