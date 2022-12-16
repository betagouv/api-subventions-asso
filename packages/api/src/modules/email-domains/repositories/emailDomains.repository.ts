import db from "../../../shared/MongoConnection";
import EmailDomain from "../@types/EmailDomain";

export class EmailDomainsRepository {
    private readonly collection = db.collection<EmailDomain>("email-domains");

    public async add(domain) {
        await this.collection.insertOne({ domain });
        return domain;
    }
}

const emailDomainsRepository = new EmailDomainsRepository();
export default emailDomainsRepository;
