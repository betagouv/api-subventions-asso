/* global $crisp:readonly */

export class CrispService {
    setUserEmail(email) {
        $crisp.push(["set", "user:email", [email]]);
    }
}

const crispService = new CrispService();

export default crispService;
