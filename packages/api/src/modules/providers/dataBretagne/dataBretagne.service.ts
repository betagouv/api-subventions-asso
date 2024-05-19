import dataBretagnePort from "../../../dataProviders/api/dataBretagne/dataBretagne.port";
import ProgrammeAdapter from "../../../dataProviders/db/programme/programme.adapter";
import programmePort from "../../../dataProviders/db/programme/programme.port";

class DataBretagneService {
    async login() {
        return dataBretagnePort.login();
    }

    async update() {
        await dataBretagnePort.login();
        const programmes = await dataBretagnePort.getProgrammes();
        // do not replace programmes if empty
        if (!programmes || !programmes.length) throw new Error("Unhandled error from API Data Bretagne");
        return programmePort.replace(programmes.map(programme => ProgrammeAdapter.toDbo(programme)));
    }
}

const dataBretagneService = new DataBretagneService();
export default dataBretagneService;
