import { FRONT_OFFICE_URL } from "../../configurations/front.conf";
import ProviderFactory from "./providers/provider-factory";

export class MailNotifierService {
    private provider = ProviderFactory.getProvider();
    
    public async sendTestMail(email: string) {
        await this.provider.sendMail(email, "Envoi de mail test", 
            `<h1>Data Subvention</h1>
            <p>Ceci est un mail de test, merci de ne pas en prendre compte.</p>

            <p>Bonne journée, de la part de l'équipe DataSubvention !</p>`
            , `
            Data Subvention
            Ceci est un mail de test, merci de ne pas en prendre compte.

            Bonne journée, de la part de l'équipe DataSubvention !
        `);
    }

    public async sendCreationMail(email: string, token: string) {
        await this.provider.sendMail(
            email,
            "Inscription à la plateforme DataSubvention",
            `
            <p>
                Bienvenue sur la plateforme DataSubvention !
            </p>
            <p> 
            Vous voilà inscrit à notre portail interministériel qui recense toutes les informations pour instruire vos demandes de subvention, <a href="${FRONT_OFFICE_URL}/auth/reset-password/${token}?active=true">pour activer votre compte c'est par ici </a> !
            </p>
            <p>
            <b class="term">Vous avez une démo programmée avec notre équipe dans les jours qui viennent ?</b>
            </p>
            <p>
            Inutile d'aller plus loin, nous prendrons le temps d'activer votre compte ensemble, lors de cet échange.
            </p>
            <p>
            <b class="term">Vous souhaitez assister à une démo de l'outil ?</b>
            </p>
            <p>
            Inscrivez-vous <a href="https://calendly.com/alexandra-morel-1/demo-data-subvention?month=2022-03">sur ce lien </a>.
            </p>
            
            <p>Bonne journée et à bientôt sur notre plateforme !</p>
            <p>L'équipe DataSubvention</p>
            `,
            `
           Bienvenue sur la plateforme DataSubvention !
            
           Vous voilà inscrit à notre portail interministériel qui recense toutes les informations pour instruire vos demandes de subvention, <a href="${FRONT_OFFICE_URL}/auth/reset-password/${token}?active=true">pour activer votre compte c'est par ici </a> !
           
           Vous avez une démo programmée avec notre équipe dans les jours qui viennent ?
           Inutile d'aller plus loin, nous prendrons le temps d'activer votre compte ensemble, lors de cet échange.
           
           Vous souhaitez assister à une démo de l'outil ?
           Inscrivez-vous <a href="https://calendly.com/alexandra-morel-1/demo-data-subvention?month=2022-03">sur ce lien </a>.
           
            Bonne journée et à bientôt sur notre plateforme !
            L'équipe DataSubvention `
        )
    }

    public async sendForgetPassword(email: string, token: string) {
        await this.provider.sendMail(
            email,
            "Mot de passe perdu -- DataSubvention",
            `<h1>Data Subvention</h1>
            <p>
                Vous avez fait une demande de mot de passe perdu sur la plateforme DataSubvention.
            </p>
            <p>
                Pour changer votre mot de passe, veuillez  vous rendre sur la page d'activation en cliquant <a href="${FRONT_OFFICE_URL}/auth/reset-password/${token}">ici</a>
            </p>
            
            <p>Bonne journée, et à bientôt sur notre plateforme !</p>
            <p>L'équipe DataSubvention</p>
            `,
            `Data Subvention
            
            Vous avez fait une demande de mot de passe perdu sur la plateforme DataSubvention.
            
            
            Pour changer votre mot de passe, veuillez vous rendre sur la page d'activation en cliquant sur ce lien : ${FRONT_OFFICE_URL}/auth/reset-password/${token} .


            Bonne journée et à bientôt sur notre plateforme !
            L'équipe DataSubvention 
            `,
        )
    }
}

const mailNotifierService = new MailNotifierService();

export default mailNotifierService;
