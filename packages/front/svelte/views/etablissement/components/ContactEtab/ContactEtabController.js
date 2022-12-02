import { buildCsv, downloadCsv } from "../../../../helpers/csvHelper";
import { formatPhoneNumber, valueOrHyphen } from "../../../../helpers/dataHelper";
import { writable } from "svelte/store";

export default class ContactEtabController {
    constructor(contacts) {
        this._contacts = contacts.map(this._format);
        this._filteredContacts = writable(this._contacts);
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
        this.filter();
    }

    filterByRole(index) {
        this.selectedRole = this.roles[index];
        this.filter();
    }

    reset() {
        this._filteredContacts.set(this._contacts);
    }

    download() {
        downloadCsv(
            buildCsv(
                this.getHeaders(),
                this._contacts.map(contact => Object.values(contact))
            )
        );
    }

    _format(contact) {
        const _contact = { ...contact };
        _contact.telephone = formatPhoneNumber(_contact.telephone);
        for (const property in _contact) {
            _contact[property] = valueOrHyphen(_contact[property]);
        }
        return _contact;
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
}
