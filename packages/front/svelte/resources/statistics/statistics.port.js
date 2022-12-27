import axios from "axios";
import { toQueryString } from "../../helpers/requestsHelper";

class StatisticsPort {
    BASE_PATH = "/stats";
    getTopAssociations(limit, start, end) {
        const query = { limit, start, end };

        const path = `${this.BASE_PATH}/associations?${toQueryString(query)}`;
        return axios.get(path).then(result => {
            if (!result.data.success) throw new Error(result.data.message);
            return result.data.data;
        });
    }
}

const statisticsPort = new StatisticsPort();
export default statisticsPort;
