import { IAssociation } from '@api-subventions-asso/dto';
import DemandeSubvention from '@api-subventions-asso/dto/search/DemandeSubventionDto';
import ProviderValue from '@api-subventions-asso/dto/shared/ProviderValue';
import e, { NextFunction, Request, Response } from 'express';
import { DefaultObject } from '../../@types/utils';
import Controller from '../../decorators/controller.decorator';
import { Get } from '../../decorators/http.methods.decorator';
import apiDatasubService from '../../shared/apiDatasub.service';
import IdentifierHelper from '../../shared/helpers/IdentifierHelper';
import ProviderValueHelper from '../../shared/helpers/ProviderValueHelper';

@Controller("/association")
export default class AssociationController {

    @Get("/*")
    public async loginView(req: Request, res: Response, next: NextFunction) {
        const [_, id] = req.url.split("/association/");

        if (!id) return res.redirect("/?error=TYPE_UNKNOWN");

        const type = IdentifierHelper.findType(id);

        if (type === "UNKNOWN") return res.redirect("/?error=TYPE_UNKNOWN"); // TODO send error

        let association: IAssociation | null = null;

        if (type === "RNA") {
            const result = await apiDatasubService.searchAssoByRna(id, req);

            if (result.status != 200 || !result.data.success || !result.data.association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error
            association = result.data.association;
        }


        if (type === "SIREN") {
            const result = await apiDatasubService.searchAssoBySiren(id, req);

            if (result.status != 200 || !result.data.success || !result.data.association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error
            association = result.data.association;
        }

        if (!association) return res.redirect("/?error=ASSO_NOT_FOUND"); // TODO send error

        const subventions = this.formatSubvention(association);
        res.render('association/index', {
            pageTitle: 'Recherche',
            value: id,
            association,
            subventions
        });
    }
    
    private formatSubvention(association: IAssociation) {
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
        association.etablissements?.reduce((acc, etablisement) => {
            if (!etablisement.demandes_subventions || etablisement.demandes_subventions.length === 0) return acc;
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

                acc.years.add(year)
                if (!acc.byYear[year]) acc.byYear[year] = {};


                if (!acc.byYear[year][status]) acc.byYear[year][status] = {};

                const service = ProviderValueHelper.getValue(demande.service_instructeur) || "AUTRES";

                if (!acc.byYear[year][status][service]) acc.byYear[year][status][service] = {
                    total: 0,
                    demande: 0,
                    propose: 0,
                    accorde: 0,
                };

                acc.byYear[year][status][service].demande += 
                    !demande.montants
                        ? 0
                        : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;
    
                acc.byYear[year][status][service].propose += 
                    !demande.montants
                        ? 0
                        : ProviderValueHelper.getValue(demande.montants.propose as ProviderValue<number>) || 0;

                acc.byYear[year][status][service].accorde += 
                    !demande.montants
                        ? 0
                        : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

                
                if (!acc.totalAccordeByYear[year]) acc.totalAccordeByYear[year] = 0;

                acc.totalAccordeByYear[year] += !demande.montants
                    ? 0
                    : ProviderValueHelper.getValue(demande.montants.accorde as ProviderValue<number>) || 0;

                if (!acc.demandes[year]) acc.demandes[year] = [];
                acc.demandes[year].push(demande);
            });

            return acc;
        }, result);

        result.lastYear = [...result.years].sort((a, b) => a === "0000" ? Infinity : b.localeCompare(a))[0] || "0000";

        return result
    }
}