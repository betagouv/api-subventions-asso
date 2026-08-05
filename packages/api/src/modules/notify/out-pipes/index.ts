import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import brevoMailNotifyPipe from "./brevo-mail.pipe";
import brevoContactNotifyPipe from "./brevo-contact.pipe";
import tchapNotifyPipe from "./tchap.pipe";

export default [brevoMailNotifyPipe, brevoContactNotifyPipe, tchapNotifyPipe] as NotifyOutPipe[];
