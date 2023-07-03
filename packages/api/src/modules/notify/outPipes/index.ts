import { NotifyOutPipe } from "../@types/NotifyOutPipe";
import brevoMailNotify from "./BrevoMailNotify";
import brevoContactNotify from "./BrevoContactNotify";

export default [brevoMailNotify, brevoContactNotify] as NotifyOutPipe[];
