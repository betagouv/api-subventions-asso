import express from "express";
import associationService from "../../modules/associations/associations.service";
import ControllerSSE from "../../decorators/controllerSSE.decorator";
import { Get } from "../../decorators/sse.methods.decorator";
import SSEResponse from "../../sse/@types/SSEResponse";

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
            const flux = await associationService.getSubventions(req.params.identifier);

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
