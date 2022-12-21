import { BadRequestError, InternalServerError } from "../../shared/errors/httpErrors";
import { REGEX_MAIL_DOMAIN } from "../user/user.constant";
import emailDomainsRepository from "./repositories/emailDomains.repository";

class EmailDomainsService {
    public async add(domain: string) {
        if (!REGEX_MAIL_DOMAIN.test(domain)) {
            throw new BadRequestError();
        }
        try {
            return await emailDomainsRepository.add(domain);
        } catch (e) {
            throw new InternalServerError();
        }
    }

    public getAll() {
        return emailDomainsRepository.findAll();
    }
}

const emailDomainsService = new EmailDomainsService();
export default emailDomainsService;
