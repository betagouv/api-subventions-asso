import { buildCsv, downloadCsv } from "$lib/helpers/csvHelper";
import { formatPhoneNumber, valueOrHyphen } from "$lib/helpers/dataHelper";
import Store from "$lib/core/Store";

export default class ContactEtabController {
    constructor(contacts, siret) {
        this._contacts = contacts.map(this._format);
        this._siret = siret;
        this._filteredContacts = new Store(this._contacts);
        this.roles = this._getRoles();
        this._selectedRoleIndex = 0;
        this._inputName = "";
    }

    getHeaders = () => ["Civilité", "Nom", "Prénom", "Téléphone", "Email", "Rôle"];

    get contacts() {
        return this._filteredContacts;
    }

    get inputName() {
        return this._inputName;
    }

    set inputName(v) {
        this._inputName = v;
        this._filter();
    }

    get hasContact() {
        return this._contacts.length > 0;
    }

    filterByRole(index) {
        this._selectedRoleIndex = index;
        this._filter();
    }

    reset() {
        this._filteredContacts.set(this._contacts);
    }

    download() {
        downloadCsv(
            buildCsv(
                this.getHeaders(),
                this._contacts.map(contact => Object.values(contact)),
            ),
            this._buildCsvName(),
        );
    }

    _format(contact) {
        return {
            civilite: valueOrHyphen(contact.civilite),
            nom: valueOrHyphen(contact.nom),
            prenom: valueOrHyphen(contact.prenom),
            telephone: valueOrHyphen(formatPhoneNumber(contact.telephone)),
            email: valueOrHyphen(contact.email),
            role: valueOrHyphen(contact.role),
        };
    }

    _filter() {
        if (this._selectedRoleIndex === 0 && this._inputName === "") this.reset();
        else {
            let filteredByNameContacts = this._contacts.filter(contact => this._containsName(contact));
            if (this._selectedRoleIndex === 0) this._filteredContacts.set(filteredByNameContacts);
            else {
                const filteredByNameAndRoleContacts = filteredByNameContacts.filter(contact =>
                    this._containsRole(contact),
                );
                this._filteredContacts.set(filteredByNameAndRoleContacts);
            }
        }
    }

    _containsRole(contact) {
        return contact.role === this.roles[this._selectedRoleIndex];
    }

    _containsName(contact) {
        return (
            contact.nom.toLowerCase().includes(this._inputName) ||
            contact.prenom.toLowerCase().includes(this._inputName)
        );
    }

    _getRoles() {
        const roles = ["Afficher tous les rôles", ...new Set(this._contacts.map(contact => contact.role))];
        return roles.filter(contact => contact !== "-");
    }

    _buildCsvName() {
        return "Liste des contacts - SIRET " + this._siret;
    }
}
