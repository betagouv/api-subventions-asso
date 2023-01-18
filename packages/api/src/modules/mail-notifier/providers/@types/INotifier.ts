import { DefaultObject } from "../../../../@types";

export default interface INotifier {
    sendTestMail(email: string, params: DefaultObject, templateId: number): Promise<boolean>;
    sendCreationMail(email: string, params: DefaultObject): Promise<boolean>;
    sendForgetPasswordMail(email: string, params: DefaultObject): Promise<boolean>;
}
