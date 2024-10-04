import express from "express";
import ControllerSSE from "../../decorators/controllerSSE.decorator";
import { Get } from "../../decorators/sse.methods.decorator";
import SSEResponse from "../../sse/@types/SSEResponse";
import etablissementService from "../../modules/etablissements/etablissements.service";
import establishmentIdentifierService from "../../modules/establishment-identifier/establishment-identifier.service";

@ControllerSSE("/sse/etablissement", {
    security: "jwt",
})
export class EtablissementSse {
    /**
     * Recherche les demandes de subventions liées à un etablissement
     *
     * @summary Recherche les demandes de subventions liées à un etablissement
     * @param identifier Identifiant Siren ou Rna
     */
    @Get("/:identifier/subventions")
    public async getDemandeSubventions(req: express.Request, res: SSEResponse) {
        try {
            const identifier = await establishmentIdentifierService.getEstablishmentIdentifiers(req.params.identifier);
            const flux = await etablissementService.getSubventions(identifier);

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
