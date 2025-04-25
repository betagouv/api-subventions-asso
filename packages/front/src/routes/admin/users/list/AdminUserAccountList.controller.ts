import adminService from "../../admin.service";
import userService from "$lib/resources/users/user.service";
import { buildCsv, downloadCsv } from "$lib/helpers/csvHelper";
import Store from "$lib/core/Store";

export default class AdminUserAccountListController {
    public promises: Promise<unknown>;
    public newDomain: Store<string>;
    public domainError: Store<boolean | undefined>;
    // TODO: create a type for this
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public users: Store<any[]>;

    constructor() {
        this.newDomain = new Store("");
        this.domainError = new Store(undefined);
        this.users = new Store([]);

        const usersPromise = new Store(
            adminService.getUsers().then(users => {
                users.filter(u => !u.email.includes("@deleted.datasubvention.beta.gouv.fr"));
                this.users.set(users.reverse());
            }),
        );
        this.promises = usersPromise.value;
    }

    async addDomain() {
        try {
            await adminService.addDomain(this.newDomain.value);
            this.domainError.set(false);
        } catch {
            this.domainError.set(true);
        }
    }

    downloadUsersCsv() {
        const csvRows = this.users.value.map(user => [
            user.email,
            user.roles.join(" - "),
            !user.active ? "Compte à activer" : userService.isUserActif(user) ? "Oui" : "Inactif",
            new Date(user.signupAt).toLocaleDateString(),
            user.resetToken ? `/auth/reset-password/${user.resetToken}?active=true` : "",
            user.resetTokenDate ? new Date(user.resetTokenDate).toLocaleString() : "",
            user.nbVisits,
            new Date(user.lastActivityDate).toLocaleString(),
        ]);

        const csvHeader = [
            "Email",
            "Roles",
            "Actif",
            "Date d'inscription",
            "Lien d'activation",
            "Date du token de reset",
            "Nombres de recherches",
            "Date dernière recherche",
        ];

        const csvString = buildCsv(csvHeader, csvRows);

        downloadCsv(csvString, `users-${new Date().toLocaleDateString()}`);
    }
}
