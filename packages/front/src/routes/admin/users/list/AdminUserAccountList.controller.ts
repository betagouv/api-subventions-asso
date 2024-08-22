import adminService from "../../admin.service";
import userService from "$lib/resources/users/user.service";
import { buildCsv, downloadCsv } from "$lib/helpers/csvHelper";
import Store from "$lib/core/Store";

export default class AdminUserAccountListController {
    public promises: Promise<void>;
    public newDomain: Store<string>;
    public domainError: Store<boolean | undefined>;
    public users: Store<any[]>;
    public domains: Store<unknown>;

    constructor() {
        const usersPromise = new Store(
            adminService
                .getUsers()
                .then(users => users.filter(u => !u.email.includes("@deleted.datasubvention.beta.gouv.fr"))),
        );
        const domainsPromise = new Store(adminService.getUserDomaines());
        this.newDomain = new Store("");
        this.domainError = new Store(undefined);
        this.domains = new Store([]);
        this.users = new Store([]);
        this.promises = Promise.all([usersPromise.value, domainsPromise.value]).then(results => {
            this.users.set(results[0].reverse());
            this.domains.set(results[1]);
        });
    }

    async addDomain() {
        try {
            await adminService.addDomain(this.newDomain.value);
            this.domainError.set(false);
        } catch (e) {
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
            user.stats.searchCount,
            new Date(user.stats.lastSearchDate).toLocaleString(),
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
