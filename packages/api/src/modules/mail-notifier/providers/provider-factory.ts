import INotifier from "./@types/INotifier";
import SendInBlueProvider from "./sendinblue.provider";

export default class ProviderFactory {
    static getProvider(): INotifier {
        return new SendInBlueProvider();
    }
}
