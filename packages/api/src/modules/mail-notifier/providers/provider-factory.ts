import IProvider from "./@types/INotifier";
import NodeMailerProvider from "./nodemailer.provider";

export default class ProviderFactory {
    static getProvider(): IProvider {
        return new NodeMailerProvider();
    }
}