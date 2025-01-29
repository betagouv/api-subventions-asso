import requestsService from "$lib/services/requests.service";

class DataVizPort {
    getResource(resource: string) {
        return requestsService.get(`/dataViz/${resource}`);
    }

    async getAmountsVsProgramRegion() {
        return (await this.getResource("montant-vs-programme-region"))?.data;
    }
}

const dataVizPort = new DataVizPort();

export default dataVizPort;