import { siretToSiren } from "../../../shared/helpers/SirenHelper";

import { Siret, Siren, Rna } from "@api-subventions-asso/dto";
import rnaSirenRepository from "./repositories/rnaSiren.repository";
import RnaSiren from "./entities/RnaSirenEntity";
import osirisService from "../../providers/osiris/osiris.service";
import leCompteAssoService from "../../providers/leCompteAsso/leCompteAsso.service";
import dataEntrepriseService from "../../providers/dataEntreprise/dataEntreprise.service";
import RequestEntity from "../../search/entities/RequestEntity";
import EventManager from "../../../shared/EventManager";
import { WithId } from "mongodb";

export interface EventRnaSirenMatching {
    rna: Rna;
    siren: Siren;
}

export class RnaSirenService {
    constructor() {
        EventManager.add("rna-siren.matching");

        EventManager.on("rna-siren.matching", {}, (cbStop, data) => {
            this.add((data as EventRnaSirenMatching).rna, (data as EventRnaSirenMatching).siren);
        });
    }

    async getRna(siren: Siret | Siren, withTimeout = false) {
        siren = siretToSiren(siren);

        const entity = await rnaSirenRepository.findBySiren(siren);

        if (entity) return entity.rna;

        const rna = await this.findRnaBySiren(siren, withTimeout);

        if (rna) await this.add(rna, siren);

        return rna;
    }

    // Used to remove _id to avoid typescript manipulation...
    private toRnaSiren(entity: WithId<RnaSiren> | null) {
        if (!entity) return entity;
        return new RnaSiren(entity.rna, entity.siren, entity.names);
    }

    async getSiren(rna: Rna, withTimeout = false) {
        const entity = await rnaSirenRepository.findByRna(rna);
        if (entity) return entity.siren;

        const siren = await this.findSirenByRna(rna, withTimeout);

        if (siren) await this.add(rna, siren);

        return siren;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async add(rna: Rna, siren: Siren) {
        siren = siretToSiren(siren);
        const entity = await rnaSirenRepository.findBySiren(siren);
        if (!entity) return await rnaSirenRepository.create(new RnaSiren(rna, siren));
    }

    async insertMany(entities: RnaSiren[]) {
        await rnaSirenRepository.insertMany(entities);
    }

    async cleanDuplicate() {
        await rnaSirenRepository.cleanDuplicate();
    }

    private async findSirenByRna(rna: Rna, withTimeout = false) {
        const providers = [osirisService, leCompteAssoService];

        const siret = await providers.reduce(async (acc, provider) => {
            const siret = await acc;
            if (siret) return siret;
            const requests = (await provider.findByRna(rna)) as RequestEntity[];

            return requests.find(r => r.legalInformations.siret)?.legalInformations.siret || null;
        }, Promise.resolve(null) as Promise<null | string>);

        if (siret) return siretToSiren(siret);

        const asso = await dataEntrepriseService.findAssociationByRna(rna, withTimeout);
        if (!asso || !asso.siren || !asso.siren?.length) return null;

        return asso.siren[0].value;
    }

    private async findRnaBySiren(siren: Siren, withTimeout = false) {
        const osirisAsso = await osirisService.getAssociationsBySiren(siren);

        if (osirisAsso && osirisAsso.length != 0 && osirisAsso.find(a => a.siren && a.siren.find(s => s.value))) {
            return osirisAsso.reduce((acc, asso) => {
                if (acc || !asso.rna) return acc;

                const pv = asso.rna.find(pv => pv.value);

                return (pv && pv.value) || null;
            }, null as null | Rna);
        }

        const lcaAsso = await leCompteAssoService.getAssociationsBySiren(siren);

        if (lcaAsso && lcaAsso.length != 0 && lcaAsso.find(a => a.siren && a.siren.find(s => s.value))) {
            return lcaAsso.reduce((acc, asso) => {
                if (acc || !asso.rna) return acc;

                const pv = asso.rna.find(pv => pv.value);

                return (pv && pv.value) || null;
            }, null as null | Rna);
        }

        const asso = await dataEntrepriseService.findAssociationBySiren(siren, withTimeout);
        if (!asso || !asso.rna || !asso.rna?.length) return null;

        return asso.rna[0].value;
    }
}

const rnaSirenService = new RnaSirenService();

export default rnaSirenService;
