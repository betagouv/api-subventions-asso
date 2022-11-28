import blaguesPort from "./blagues.port";

class BlaguesService {
    getBlagues() {
        return new Promise(resolve => {
            resolve(blaguesPort.getBlagues());
        });
    }
}

const blaguesService = new BlaguesService();

export default blaguesService;
