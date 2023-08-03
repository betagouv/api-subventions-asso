// @ts-expect-error -- $crisp
declare const $crisp;

export class CrispService {
    setUserEmail(email: string) {
        $crisp.push(["set", "user:email", [email]]);
    }

    resetSession() {
        $crisp.push(["do", "session:reset"]);
    }
}

const crispService = new CrispService();

export default crispService;
