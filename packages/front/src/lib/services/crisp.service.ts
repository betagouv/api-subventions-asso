declare const $crisp;

export class CrispService {
    setUserEmail(email: string) {
        $crisp.push(["set", "user:email", [email]]);
    }

    resetSession() {
        $crisp.push(["do", "session:reset"]);
    }

    seenBodacc() {
        $crisp.push(["set", "session:data", ["seen_bodacc", "seen"]]);
    }
}

const crispService = new CrispService();

export default crispService;
