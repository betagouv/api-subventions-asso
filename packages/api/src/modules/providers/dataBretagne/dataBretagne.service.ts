import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
import BopAdapter from "../../../dataProviders/db/bop/bop.adapter";
import bopPort from "../../../dataProviders/db/bop/bop.port";

class DataBretagneService {
    async login() {
        return dataBretagnePort.login();
    }

    async update() {
        await dataBretagnePort.login();
        const programmes = await dataBretagnePort.getProgrammes();
        return bopPort.replace(programmes.map(programme => BopAdapter.toDbo(programme)));
    }
}

const dataBretagneService = new DataBretagneService();
export default dataBretagneService;
