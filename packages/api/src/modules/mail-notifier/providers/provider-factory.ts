import INotifier from "./@types/INotifier";
import NodeMailerProvider from "./nodemailer.provider";

export default class ProviderFactory {
    static getProvider(): INotifier {
        return new NodeMailerProvider();
    }
}