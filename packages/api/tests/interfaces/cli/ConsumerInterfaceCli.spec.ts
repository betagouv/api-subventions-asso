import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../src/configurations/jwt.conf";
import ConsumerCli from "../../../src/interfaces/cli/Consumer.cli";
import consumerTokenPort from "../../../src/dataProviders/db/user/consumer-token.port";
import userPort from "../../../src/dataProviders/db/user/user.port";
import { UserDto } from "dto";

describe("ConsumerCli", () => {
    const cli = new ConsumerCli();
    const EMAIL = "test@beta.gouv.fr";
    describe("create", () => {
        it("should create a user", async () => {
            await cli.create(EMAIL);
            const actual = await userPort.findByEmail(EMAIL);
            expect(actual).toMatchSnapshot({
                _id: expect.any(ObjectId),
                signupAt: expect.any(Date),
            });
        });

        it("should create a consumer token with user info", async () => {
            await cli.create(EMAIL);
            const user = (await userPort.findByEmail(EMAIL)) as UserDto;
            const token = (await consumerTokenPort.findToken(user._id)) as string;
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
