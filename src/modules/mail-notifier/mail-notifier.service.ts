import ProviderFactory from "./providers/provider-factory";

export class MailNotifierService {
    private provider = ProviderFactory.getProvider();
    
    public async sendTestMail(email: string) {
        await this.provider.sendMail(email, "Envoie de mail test", 
            `<h1>Data Subvention</h1>
                <p>Ceci est un mail de test merci de ne pas en prendre compte.</p>

                <p>Bonne journée, de la part de l'équipe DataSubvention !</p>`
            , `
            Data Subvention
            Ceci est un mail de test merci de ne pas en prendre compte

            Bonne journée, de la part de l'équipe DataSubvention !
        `);
    }
}

const mailNotifierService = new MailNotifierService();

export default mailNotifierService;