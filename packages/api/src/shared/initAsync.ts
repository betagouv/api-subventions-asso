import dataBretagneService from "../modules/providers/dataBretagne/dataBretagne.service";
import scdlService from "../modules/providers/scdl/scdl.service";

const asyncServices = [scdlService, dataBretagneService];

export async function initAsync() {
    await Promise.all(asyncServices.map(service => service.init()));
}
