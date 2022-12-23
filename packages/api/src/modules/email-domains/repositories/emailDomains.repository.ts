import db from "../../../shared/MongoConnection";
import EmailDomain from "../@types/EmailDomain";

export class EmailDomainsRepository {
    private readonly collection = db.collection<EmailDomain>("email-domains");

    public async add(domain: string) {
        await this.collection.insertOne({ domain });
        return domain;
    }

    public findOne(domain) {
        return this.collection.findOne({ domain });
    }

    public findAll() {
        return this.collection.find({}).toArray();
    }
}

const emailDomainsRepository = new EmailDomainsRepository();
export default emailDomainsRepository;
