import ContactEtabController from "./ContactEtabController";
import { formatPhoneNumber, valueOrHyphen } from "$lib/helpers/dataHelper";

vi.mock("$lib/helpers/dataHelper.js", async () => {
    const actual = vi.importActual("$lib/helpers/dataHelper.js");
    return {
        ...actual,
        valueOrHyphen: vi.fn(v => v),
        formatPhoneNumber: vi.fn(v => v),
    };
});

describe("ContactEtabController", () => {
    const ROLES = ["Afficher tous les rôles", "Coordinatrice", "Président"];
    const CONTACTS = [
        {
            civilite: "Madame",
            nom: "DOE",
            prenom: "Jane",
            telephone: "06 01 02 03 04",
            email: "coordination@foo.bar",
            role: ROLES[1],
        },
        {
            nom: "MARTIN",
            prenom: "François",
            telephone: "06 11 22 33 44",
            email: "contact@foo.bar",
            role: ROLES[2],
        },
        {
            nom: "DOE",
            prenom: "Jane",
            telephone: "06 01 02 03 04",
            email: "coordination@foo.bar",
            role: ROLES[1],
        },
        {
            nom: "BLACK",
            prenom: "Jeff",
            telephone: "07 11 22 33 57",
            email: "coordination@foo.bar",
            role: ROLES[1],
        },
    ];

    let controller;

    beforeEach(() => {
        controller = new ContactEtabController(CONTACTS);
        vi.clearAllMocks();
    });

    describe("hasContact", () => {
        it("should return true", () => {
            expect(controller.hasContact).toBe(true);
        });

        it("should return false", () => {
            controller = new ContactEtabController([]);
            expect(controller.hasContact).toBe(false);
        });
    });

    describe("_containsRole()", () => {
        it("should return true with role selected", () => {
            const expected = true;
            controller._selectedRoleIndex = 1;
            const actual = controller._containsRole(CONTACTS[0]);
            expect(actual).toEqual(expected);
        });

        it("should return false", () => {
            const expected = false;
            controller._selectedRoleIndex = 2;
            const actual = controller._containsRole(CONTACTS[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("_getRoles()", () => {
        it("should return an array of roles", () => {
            const expected = ROLES;
            const actual = controller._getRoles();
            expect(actual).toEqual(expected);
        });
    });

    describe("_containsName()", () => {
        it("should return true with empty inputName", () => {
            const expected = true;
            controller._inputName = "";
            const actual = controller._containsName(CONTACTS[0]);
            expect(actual).toEqual(expected);
        });
        it("should return true", () => {
            const expected = true;
            controller._inputName = "doe";
            const actual = controller._containsName(CONTACTS[0]);
            expect(actual).toEqual(expected);
        });
        it("should return false", () => {
            const expected = false;
            controller._inputName = "jeff";
            const actual = controller._containsName(CONTACTS[0]);
            expect(actual).toEqual(expected);
        });
    });

    describe("_filter()", () => {
        it("should filter contacts on name", () => {
            let actual;
            controller._inputName = "doe";
            controller._filter();
            controller.contacts.subscribe(value => (actual = value));
            expect(actual).toMatchSnapshot();
        });

        it("should filter contacts on role", () => {
            let actual;
            controller._selectedRoleIndex = 1;
            controller._filter();
            controller.contacts.subscribe(value => (actual = value));
            expect(actual).toMatchSnapshot();
        });
    });

    describe("_format()", () => {
        it("should return format telephone", () => {
            const expected = 1;
            controller._format(CONTACTS[0]);
            const actual = formatPhoneNumber.mock.calls.length;
            expect(actual).toEqual(expected);
        });
        it("should replace empty value with hyphen", () => {
            const expected = 6;
            controller._format(CONTACTS[0]);
            const actual = valueOrHyphen.mock.calls.length;
            expect(actual).toEqual(expected);
        });
    });
});
