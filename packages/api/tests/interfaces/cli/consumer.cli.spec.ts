import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../src/configurations/jwt.conf";
import ConsumerCli from "../../../src/adapters/inputs/cli/consumer.cli";
import consumerTokenAdapter from "../../../src/adapters/outputs/db/user/consumer-token.adapter";
import userAdapter from "../../../src/adapters/outputs/db/user/user.adapter";

describe("ConsumerCli", () => {
    const cli = new ConsumerCli();
    const EMAIL = "test@beta.gouv.fr";
    describe("create", () => {
        it("should create a user", async () => {
            await cli.create(EMAIL);
            const actual = await userAdapter.findByEmail(EMAIL);
            expect(actual).toMatchSnapshot({
                id: expect.any(String),
                signupAt: expect.any(Date),
                lastActivityDate: expect.any(Date),
            });
        });

        it("should create a consumer token with user info", async () => {
            await cli.create(EMAIL);
            const user = await userAdapter.findByEmail(EMAIL);
            const token = await consumerTokenAdapter.findToken(user.id);
            const actual = jwt.verify(token, JWT_SECRET);

            expect(actual).toMatchSnapshot({
                iat: expect.any(Number),
                id: expect.any(String),
                signupAt: expect.any(String),
                lastActivityDate: expect.any(String),
                now: expect.any(String),
            });
        });
    });
});
