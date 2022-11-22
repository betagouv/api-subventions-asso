import { NextFunction, Request, Response } from "express";
import { DefaultObject } from "../../../../@types/utils";
import Controller from "../../../../decorators/controller.decorator";
import { Get } from "../../../../decorators/http.methods.decorator";
import EJSHelper from "../../../../shared/helpers/EJSHelper";
import etablissementService from "../../EtablissementService";
import { createCsvFromArray } from "../../../../../svelte/helpers/dataHelper";
import { Etablissement } from "@api-subventions-asso/dto";

@Controller("/etablissement")
export default class EtablissementController {
    @Get("/:id")
    public async etablissementView(req: Request, res: Response, next: NextFunction) {
        const siret = req.params.id;

        if (!siret) return res.redirect("/?error=TYPE_UNKNOWN");

        const result = (await etablissementService.getEtablissement(siret, req.session.user)) as {
            type: "SUCCESS" | "ERROR";
            data: DefaultObject;
        };

        if (result.type != "SUCCESS") {
            return res.redirect("/?error=TYPE_UNKNOWN"); // TODO send error
        }

        let contactDownloadLink: string | undefined = undefined;

        const etablissement = result.data.etablissement as Etablissement;

        if (etablissement.contacts) {
            const contactHeader = ["Civilité", "Nom", "Prénom", "Téléphone", "Email", "Rôle"];
            const contactRows = etablissement.contacts.map(contact => {
                const contactValue = EJSHelper.getValue(contact);
                return [
                    EJSHelper.returnValueOrHyphen(contactValue?.civilite),
                    EJSHelper.returnValueOrHyphen(contactValue?.nom),
                    EJSHelper.returnValueOrHyphen(contactValue?.prenom),
                    EJSHelper.returnValueOrHyphen(contactValue?.telephone ? EJSHelper.phone.format(contactValue.telephone) : undefined),
                    EJSHelper.returnValueOrHyphen(contactValue?.email),
                    EJSHelper.returnValueOrHyphen(contactValue?.role)
                ];
            })

            contactDownloadLink = encodeURI(`data:text/csv;charset=utf-8,${createCsvFromArray(contactHeader, contactRows)}`)
        }

        res.render("etablissement/index", {
            pageTitle: "Établissement",
            etablissement: etablissement,
            association: result.data.association,
            subventions: result.data.subventions,
            versements: result.data.versements,
            contactDownloadLink
        });
    }
}
