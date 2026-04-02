import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../src/configurations/jwt.conf";
import ConsumerCli from "../../../src/adapters/inputs/cli/Consumer.cli";
import consumerTokenAdapter from "../../../src/adapters/outputs/db/user/consumer-token.adapter";
import userAdapter from "../../../src/adapters/outputs/db/user/user.adapter";
import { UserDto } from "dto";

describe("ConsumerCli", () => {
    const cli = new ConsumerCli();
    const EMAIL = "test@beta.gouv.fr";
    describe("create", () => {
        it("should create a user", async () => {
            await cli.create(EMAIL);
            const actual = await userAdapter.findByEmail(EMAIL);
            expect(actual).toMatchSnapshot({
                _id: expect.any(ObjectId),
                signupAt: expect.any(Date),
            });
        });

        it("should create a consumer token with user info", async () => {
            await cli.create(EMAIL);
            const user = (await userAdapter.findByEmail(EMAIL)) as UserDto;
            const token = (await consumerTokenAdapter.findToken(user._id)) as string;
            const actual = jwt.verify(token, JWT_SECRET);
            expect(actual).toMatchSnapshot({
                iat: expect.any(Number),
                _id: expect.any(String),
                signupAt: expect.any(String),
                now: expect.any(String),
            });
        });
    });
});
