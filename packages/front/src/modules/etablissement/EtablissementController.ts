import { IAssociation, IEtablissement } from '@api-subventions-asso/dto';
import DemandeSubvention from '@api-subventions-asso/dto/search/DemandeSubventionDto';
import ProviderValue from '@api-subventions-asso/dto/shared/ProviderValue';
import e, { NextFunction, Request, Response } from 'express';
import { DefaultObject } from '../../@types/utils';
import Controller from '../../decorators/controller.decorator';
import { Get } from '../../decorators/http.methods.decorator';
import apiDatasubService from '../../shared/apiDatasub.service';
import IdentifierHelper from '../../shared/helpers/IdentifierHelper';
import ProviderValueHelper from '../../shared/helpers/ProviderValueHelper';

@Controller("/etablissement")
export default class EtablissementController {

    @Get("/*")
    public async loginView(req: Request, res: Response, next: NextFunction) {
        const [_, siret] = req.url.split("/etablissement/");

        if (!siret) return res.redirect("/?error=TYPE_UNKNOWN");

        const type = IdentifierHelper.findType(siret);

        if (type !== "SIRET") return res.redirect("/?error=TYPE_UNKNOWN"); // TODO send error

        let etablisement = null;

        const result = await apiDatasubService.searchEtablissement(siret, req);

        if (result.status != 200 || !result.data.success || !result.data.association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error
        association = result.data.association;

        res.send({siret});

        // if (!association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error

        // const subventions = this.formatSubvention(association);
        // res.render('association/index', {
        //     pageTitle: 'Recherche',
        //     value: id,
        //     association,
        //     subventions
        // });
    }
    
    private formatSubvention(etablisement: IEtablissement) {
        const result = {
            lastYear: "NC",
            totalAccordeByYear: {} as DefaultObject<number>,
            years: new Set<string>(),
            byYear: {} as DefaultObject<DefaultObject<DefaultObject<{
                total: number,
                demande: number,
                propose: number,
                accorde: number,
            }>>>,
            demandes: {} as DefaultObject<DemandeSubvention[]>
        };

        if (!etablisement.demandes_subventions || etablisement.demandes_subventions.length === 0) return result;

        etablisement.demandes_subventions.forEach(demande => {
            const status = ProviderValueHelper.getValue(demande.status) || "Autres";

            let year = (demande.annee_demande && ProviderValueHelper.getValue(demande.annee_demande)?.toString());

            if (!year) {
                const date = (demande.date_commision && ProviderValueHelper.getValue(demande.date_commision)) ||  ProviderValueHelper.getDate(demande.status);
                if (date) {
                    year = new Date(date).getFullYear().toString();
                } else {
                    year = "0000";
                }
            }

            result.years.add(year)
            if (!result.byYear[year]) result.byYear[year] = {};


            if (!result.byYear[year][status]) result.byYear[year][status] = {};

            const service = ProviderValueHelper.getValue(demande.service_instructeur) || "AUTRES";

            if (!result.byYear[year][status][service]) result.byYear[year][status][service] = {
                total: 0,
                demande: 0,
                propose: 0,
                accorde: 0,
            };

            result.byYear[year][status][service].demande += 
                !demande.montants
                    ? 0
                    : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;

            result.byYear[year][status][service].propose += 
                !demande.montants
                    ? 0
                    : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;

            result.byYear[year][status][service].accorde += 
                !demande.montants
                    ? 0
                    : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

            
            if (!result.totalAccordeByYear[year]) result.totalAccordeByYear[year] = 0;

            result.totalAccordeByYear[year] += !demande.montants
                ? 0
                : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

            if (!result.demandes[year]) result.demandes[year] = [];
            result.demandes[year].push(demande);
        });

        result.lastYear = [...result.years].sort((a, b) => a === "0000" ? Infinity : b.localeCompare(a))[0] || "0000";

        return result
    }
}