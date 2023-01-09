import { modal } from "../../store/modal.store";
import MoreInfosLegalesModal from "./MoreInfosLegalesModal.svelte";

export default class InfosLegalesController {
    displayModal() {
        modal.set(MoreInfosLegalesModal);
    }
}
