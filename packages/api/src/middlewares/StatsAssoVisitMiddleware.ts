import { Response } from "express";
import { isRequestFromAdmin } from "../shared/helpers/HttpHelper";
import statsService from "../modules/stats/stats.service";
import { IdentifiedRequest } from "../@types";
import { siretToSiren } from "../shared/helpers/SirenHelper";
import Siret from "../identifierObjects/Siret";

const regexPath = new RegExp("/(association|etablissement)/([W0-9]{9,10}|\\d{14})$");

export default async function StatsAssoVisitMiddleware(req: IdentifiedRequest, res: Response) {
    if (!req.user || res.statusCode >= 400 || isRequestFromAdmin(req)) return;
    const regexResult = regexPath.exec(req.originalUrl);
    if (!regexResult || !regexResult[2]) return;

    const id = Siret.isSiret(regexResult[2]) ? siretToSiren(regexResult[2]) : regexResult[2];
    await statsService.addAssociationVisit({
        userId: req.user._id,
        associationIdentifier: id,
        date: new Date(),
    });
}

export const StatsAssoVisitRoutesRegex = [regexPath];
