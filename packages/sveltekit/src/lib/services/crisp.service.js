/* global $crisp:readonly */

export class CrispService {
    setUserEmail(email) {
        $crisp.push(["set", "user:email", [email]]);
    }

    resetSession() {
        $crisp.push(["do", "session:reset"]);
    }
}

const crispService = new CrispService();

export default crispService;
