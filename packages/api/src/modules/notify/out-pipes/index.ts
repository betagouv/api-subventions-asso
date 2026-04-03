import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import brevoMailNotifyPipe from "./brevo-mail.pipe";
import brevoContactNotifyPipe from "./brevo-contact.pipe";
import mattermostNotifyPipe from "./mattermost.pipe";

export default [brevoMailNotifyPipe, brevoContactNotifyPipe, mattermostNotifyPipe] as NotifyOutPipe[];
