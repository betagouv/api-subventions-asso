import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import brevoMailNotifyPipe from "./BrevoMailNotifyPipe";
import brevoContactNotifyPipe from "./BrevoContactNotifyPipe";
import mattermostNotifyPipe from "./MattermostNotifyPipe";

export default [brevoMailNotifyPipe, brevoContactNotifyPipe, mattermostNotifyPipe] as NotifyOutPipe[];
