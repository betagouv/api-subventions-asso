vi.mock("$lib/helpers/providerValueHelper");
import establishmentService from "./establishment.service";
import establishmentPort from "./establishment.port";
vi.mock("./establishment.port");
import * as establishmentMapper from "./establishment.mapper.js";
vi.mock("./establishment.mapper");
import * as providerValuesHelper from "$lib/helpers/providerValueHelper";

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
        const establishment = { contacts: CONTACTS };
        establishmentPort.getBySiret.mockImplementation(() => establishment);
        establishmentMapper.toEstablishmentComponent.mockImplementationOnce(establishment => establishment);

        it("should call EstablishmentPort", async () => {
            await establishmentService.getBySiret(SIRET);
            expect(establishmentPort.getBySiret).toHaveBeenCalledWith(SIRET);
        });

        it("should get contacts value for each establishment", async () => {
            const spyGetContactsValue = vi
                .spyOn(establishmentService, "getContactsValue")
                .mockImplementation(contact => contact);

            await establishmentService.getBySiret(SIRET);
            expect(spyGetContactsValue).toHaveBeenCalledTimes(1);
            spyGetContactsValue.mockRestore();
        });

        it("should call toEstablishmentComponent for each establishment", async () => {
            await establishmentService.getBySiret(SIRET);
            expect(establishmentMapper.toEstablishmentComponent).toHaveBeenCalledTimes(1);
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
            const spyGetDocuments = vi.spyOn(establishmentPort, "getDocuments");
            await establishmentService.getDocuments(SIRET);
            expect(spyGetDocuments).toHaveBeenCalledWith(SIRET);
        });
    });
});
