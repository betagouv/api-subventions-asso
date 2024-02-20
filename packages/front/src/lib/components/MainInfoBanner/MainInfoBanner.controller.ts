import type { SvelteComponent } from "svelte";

export class MainInfoBannerController {
    public startTitle = "Certaines informations de votre profil sont manquantes. N’oubliez pas de ";
    public endTitle = ".";
    public linkLabel = "compléter vos informations ici";
    public linkUrl = "/user/profile";
    public closeMsg = "Ne plus afficher ce message";

    constructor(public component: SvelteComponent) {}

    close() {
        this.component.$destroy();
    }
}
