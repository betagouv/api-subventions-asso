import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../src/configurations/jwt.conf";
import ConsumerCli from "../../../src/interfaces/cli/Consumer.cli";
import consumerTokenRepository from "../../../src/modules/user/repositories/consumer-token.repository";
import userRepository from "../../../src/modules/user/repositories/user.repository";
import { UserDto } from "dto";

describe("ConsumerCli", () => {
    const cli = new ConsumerCli();
    const EMAIL = "test@beta.gouv.fr";
    describe("create", () => {
        it("should create a user", async () => {
            await cli.create(EMAIL);
            const actual = await userRepository.findByEmail(EMAIL);
            expect(actual).toMatchSnapshot({
                _id: expect.any(ObjectId),
                signupAt: expect.any(Date),
            });
        });

        it("should create a consumer token with user info", async () => {
            await cli.create(EMAIL);
            const user = (await userRepository.findByEmail(EMAIL)) as UserDto;
            const token = (await consumerTokenRepository.findToken(user._id)) as string;
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
