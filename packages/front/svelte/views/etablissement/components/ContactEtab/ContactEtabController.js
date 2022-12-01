import { buildCsv, downloadCsv } from "../../../../helpers/csvHelper";
import { formatPhoneNumber, valueOrHyphen } from "../../../../helpers/dataHelper";
import { writable } from "svelte/store";

export default class ContactEtabController {
    constructor(contacts) {
        this._contacts = contacts.map(this.formatContact);
        this._filteredContacts = writable(this._contacts);
        this._roles = this.getContactRoles();
        this._filter = "";
        this.selectedRole = "";
        this._inputName = "";
    }

    getHeaders = () => ["Civilité", "Nom", "Prénom", "Téléphone", "Email", "Rôle"];

    get contacts() {
        return this._filteredContacts;
    }

    get roles() {
        return this._roles;
    }

    get inputName() {
        return this._inputName;
    }

    set inputName(v) {
        this._inputName = v;
        this.filterContacts();
    }

    set filter(f) {
        this._filter = f;
    }

    get filter() {
        return this._filter;
    }

    formatContact = contact => {
        const _contact = { ...contact };
        _contact.telephone = formatPhoneNumber(_contact.telephone);
        for (const property in _contact) {
            _contact[property] = valueOrHyphen(_contact[property]);
        }
        return _contact;
    };

    filterByRole = index => {
        this.selectedRole = this.roles[index];
        this.filterContacts();
    };

    resetContacts = () => {
        this._filteredContacts.update(() => this._contacts);
    };

    filterContacts = () => {
        if (this.selectedRole === "" && this._inputName === "") this.resetContacts();
        else
            this._filteredContacts.update(() =>
                this._contacts.filter(contact => this.containRole(contact) && this.containName(contact))
            );
    };

    containRole = contact => !this.selectedRole || contact.role === this.selectedRole;

    containName = contact =>
        contact.nom.toLowerCase().includes(this._inputName) || contact.prenom.toLowerCase().includes(this._inputName);

    getContactRoles = () =>
        this._contacts.reduce(
            (acc, curr) => {
                if (acc.includes(curr.role)) return acc;
                acc.push(curr.role);
                return acc;
            },
            [""]
        );

    contactToArray = contact => Object.values(contact);

    download = () => {
        downloadCsv(buildCsv(this.getHeaders(), this._contacts.map(this.contactToArray)));
    };
}
