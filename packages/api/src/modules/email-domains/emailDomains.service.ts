import emailDomainsRepository from "./repositories/emailDomains.repository";

class EmailDomainsService {
    public add(domain) {
        return emailDomainsRepository.add(domain);
    }
}

const emailDomainsService = new EmailDomainsService();
export default emailDomainsService;
