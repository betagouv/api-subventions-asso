import { buildCsv, downloadCsv } from "../../../../helpers/csvHelper";
import { formatPhoneNumber, valueOrHyphen } from "../../../../helpers/dataHelper";
import Store from "../../../../core/Store";

export default class ContactEtabController {
    constructor(contacts, siret) {
        this._contacts = contacts.map(this._format);
        this._siret = siret;
        this._filteredContacts = new Store(this._contacts);
        this.roles = this._getRoles();
        this.selectedRole = "";
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

    filterByRole(index) {
        this.selectedRole = this.roles[index];
        this._filter();
    }

    reset() {
        this._filteredContacts.set(this._contacts);
    }

    download() {
        downloadCsv(
            buildCsv(
                this.getHeaders(),
                this._contacts.map(contact => Object.values(contact))
            ),
            this._buildCsvName()
        );
    }

    _format(contact) {
        return {
            civilite: valueOrHyphen(contact.civilite),
            nom: valueOrHyphen(contact.nom),
            prenom: valueOrHyphen(contact.prenom),
            telephone: valueOrHyphen(formatPhoneNumber(contact.telephone)),
            email: valueOrHyphen(contact.email),
            role: valueOrHyphen(contact.role)
        };
    }

    _filter() {
        if (this.selectedRole === "" && this._inputName === "") this.reset();
        else
            this._filteredContacts.set(
                this._contacts.filter(contact => this._containsRole(contact) && this._containsName(contact))
            );
    }

    _containsRole(contact) {
        return !this.selectedRole || contact.role === this.selectedRole;
    }

    _containsName(contact) {
        return (
            contact.nom.toLowerCase().includes(this._inputName) ||
            contact.prenom.toLowerCase().includes(this._inputName)
        );
    }

    _getRoles() {
        return ["", ...new Set(this._contacts.map(contact => contact.role))];
    }

    _buildCsvName() {
        return "Liste des contacts - SIRET " + this._siret;
    }
}
