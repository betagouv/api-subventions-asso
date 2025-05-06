import dataBretagneService from "../modules/providers/dataBretagne/dataBretagne.service";
import scdlService from "../modules/providers/scdl/scdl.service";

const asyncServices = [scdlService, dataBretagneService];

export function initAsyncServices() {
    return Promise.all(asyncServices.map(service => service.init()));
}

// put here any services used with grants that needs to be refreshed or init again
// this is used to avoid grant.service knowing about all the services
export function refreshGrantAsyncServices() {
    // scdl service needs to refresh its producer names in case another context (CLI) created new producers
    return Promise.all([scdlService.init()]);
}
