import { Response } from "express";
import { isRequestFromAdmin } from "../shared/helpers/HttpHelper";
import statsService from "../modules/stats/stats.service";
import { IdentifiedRequest } from "../@types";
import Siret from "../identifier-objects/Siret";

const regexPath = new RegExp("/(association|etablissement)/([W0-9]{9,10}|\\d{14})$");

export default async function assoVisitMiddleware(req: IdentifiedRequest, res: Response) {
    console.log(req.user, req.statusCode, isRequestFromAdmin(req));
    if (!req.user || res.statusCode >= 400 || isRequestFromAdmin(req)) return;
    const regexResult = regexPath.exec(req.originalUrl);
    if (!regexResult || !regexResult[2]) return;

    const identifier = Siret.isSiret(regexResult[2]) ? Siret.getSiren(regexResult[2]) : regexResult[2];
    await statsService.addAssociationVisit({
        userId: req.user.id,
        associationIdentifier: identifier,
        date: new Date(),
    });
}

export const StatsAssoVisitRoutesRegex = [regexPath];
