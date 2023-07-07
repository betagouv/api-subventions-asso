import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import brevoMailNotifyPipe from "./BrevoMailNotifyPipe";
import brevoContactNotifyPipe from "./BrevoContactNotifyPipe";

export default [brevoMailNotifyPipe, brevoContactNotifyPipe] as NotifyOutPipe[];
