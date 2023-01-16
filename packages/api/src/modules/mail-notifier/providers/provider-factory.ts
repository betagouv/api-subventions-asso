import INotifier from "./@types/INotifier";
import NodeMailerProvider from "./nodemailer.provider";
import SendInBlueProvider from "./sendinblue.provider";

enum MailProviderEnum {
    sendInBlue = "SendInBlue",
    nodeMailer = "NodeMailer"
}

export default class ProviderFactory {
    static getProvider(provider: Record<MailProviderEnum, string>[MailProviderEnum] = "SendInBlue"): INotifier {
        if (!provider || Object.values(MailProviderEnum).includes(provider as MailProviderEnum)) {
            switch (provider) {
                case MailProviderEnum.nodeMailer:
                    return new NodeMailerProvider();
                default:
                    return new SendInBlueProvider();
            }
        } else {
            throw new Error("Unknown provider");
        }
    }
}
