import axios from "axios";

class StatsPort {
    BASE_PATH = "/stats";
    getTopAssociations(limit) {
        const query = { limit };

        const path = `${this.BASE_PATH}/associations`;
        return axios
            .get(path, {
                params: query
            })
            .then(result => {
                if (!result.data.success) throw new Error(result.data.message);
                return result.data.data;
            });
    }
}

const statsPort = new StatsPort();
export default statsPort;
