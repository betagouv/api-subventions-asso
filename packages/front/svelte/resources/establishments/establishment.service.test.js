import * as providerValuesHelper from "@helpers/providerValueHelper";
jest.mock("../../helpers/providerValueHelper");
import establishmentService from "./establishment.service";
import establishmentPort from "./establishment.port";
jest.mock("./establishment.port");
import * as establishmentAdapter from "./establishment.adapter";
jest.mock("./establishment.adapter");

describe("establishmentService", () => {
    const SIRET = "00000000912345";

    const CONTACTS = [
        { value: { nom: "Rémi", prenom: "Saintagne", role: "Chargé de mission" }, provider: "providerA" },
        { value: { nom: "Sandrine", prenom: "Guérin", role: "Présidente" }, provider: "providerA" },
    ];

    describe("incExtractData", () => {
        it("should call establishmentPort.extractData()", () => {
            establishmentService.incExtractData(SIRET);
            expect(establishmentPort.incExtractData).toHaveBeenCalledWith(SIRET);
        });
    });

    describe("getBySiret", () => {
        const establishments = [{ contacts: CONTACTS }];
        establishmentPort.getBySiret.mockImplementation(() => establishments);
        establishmentAdapter.toEstablishmentComponent.mockImplementationOnce(establishment => establishment);

        it("should call EstablishmentPort", async () => {
            await establishmentService.getBySiret(SIRET);
            expect(establishmentPort.getBySiret).toHaveBeenCalledWith(SIRET);
        });

        it("should get contacts value for each establishment", async () => {
            const spyGetContactsValue = jest
                .spyOn(establishmentService, "getContactsValue")
                .mockImplementation(contact => contact);

            await establishmentService.getBySiret(SIRET);
            expect(spyGetContactsValue).toHaveBeenCalledTimes(establishments.length);
            spyGetContactsValue.mockRestore();
        });

        it("should call toEstablishmentComponent for each establishment", async () => {
            await establishmentService.getBySiret(SIRET);
            expect(establishmentAdapter.toEstablishmentComponent).toHaveBeenCalledTimes(establishments.length);
        });
    });

    describe("getContactsValue()", () => {
        it("should call getValue", () => {
            establishmentService.getContactsValue(CONTACTS);
            expect(providerValuesHelper.getValue).toHaveBeenCalledTimes(CONTACTS.length);
        });
    });

    describe("getDocuments()", () => {
        it("should call EstablishmentPort", async () => {
            const spyGetDocuments = jest.spyOn(establishmentPort, "getDocuments");
            await establishmentService.getDocuments(SIRET);
            expect(spyGetDocuments).toHaveBeenCalledWith(SIRET);
        });
    });
});
