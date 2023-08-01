import requestsService from "$lib/services/requests.service";

class StatsPort {
    BASE_PATH = "/stats";
    getTopAssociations(limit) {
        const query = { limit };

        const path = `${this.BASE_PATH}/associations`;
        return requestsService
            .get(path, {
                params: query,
            })
            .then(result => {
                if (result.data.message) throw new Error(result.data.message);
                return result.data.data;
            });
    }

    getMonthlyUserCount(year) {
        const path = `${this.BASE_PATH}/users/monthly/${year}`;
        return requestsService.get(path).then(result => {
            if (result.data.message) throw new Error(result.data.message);
            return result.data.data;
        });
    }

    getUsersDistribution() {
        const path = `${this.BASE_PATH}/users/status`;
        return requestsService.get(path).then(result => {
            if (!result.data.data) throw new Error(result.data.message);
            return result.data.data;
        });
    }

    getMonthlyRequestCount(year) {
        const path = `${this.BASE_PATH}/requests/monthly/${year}`;
        return requestsService.get(path).then(result => {
            if (result.data.message) throw new Error(result.data.message);
            return result.data;
        });
    }
}

const statsPort = new StatsPort();
export default statsPort;
