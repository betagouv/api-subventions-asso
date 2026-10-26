import type { UserSignupStatsDtoResponse } from "dto";
import AsyncUseCase from "../../@types/use-case/AsyncUseCase";
import userAdapter from "../../adapters/outputs/db/user/user.adapter";
import { UserPort } from "../../adapters/outputs/db/user/user.port";
import { addDaysToDate } from "../../shared/helpers/DateHelper";

export interface GetSignupStatsInput {
    from?: Date;
    to?: Date;
}

export class GetSignupStats implements AsyncUseCase<GetSignupStatsInput, UserSignupStatsDtoResponse> {
    constructor(private userPort: UserPort) {}

    async execute({ from, to }: GetSignupStatsInput = {}): Promise<UserSignupStatsDtoResponse> {
        if (!from || !to) return { total: await this.userPort.countUsers() };

        const emails = await this.userPort.findUserEmailsByPeriod(from, addDaysToDate(to, 1));
        return { total: emails.length, emails };
    }
}

const getSignupStats = new GetSignupStats(userAdapter);
export default getSignupStats;
