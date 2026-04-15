import { mock } from "jest-mock-extended";
import { SireneStockUniteLegalePort } from "../../../../adapters/outputs/db/sirene/stock-unite-legale/sirene-stock-unite-legale.port";
import ExtractHeliosApplicationFlatSpecificFields from "./extract-helios-application-flat-specific-fields.use-case";
import ExtractHeliosBeneficaryInfosUseCase from "./extract-helios-beneficary-info.use-case";
import ExtractHeliosPaymentFlatSpecificFieldsUseCase from "./extract-helios-payment-flat-specific-fields.use-case";
import TransformHeliosDtoToEntityUseCase from "./transform-helios-dto-to-entity.use-case";
import { HELIOS_ENTITY } from "../__fixtures__/helios.fixture";
import { HELIOS_DTO } from "../../../../adapters/outputs/db/providers/helios/__fixtures__/helios.fixture";
import { STOCK_UNITE_LEGALE_ENTITY } from "../../sirene/stock-unite-legale/@types/__fixtures__/sirene-stock-unite-legale.fixture";
import TransformHeliosEntitiesToFlat from "./transform-helios-entities-to-flat.use-case";
import DEFAULT_ASSOCIATION from "../../../../../tests/__fixtures__/association.fixture";
import Siret from "../../../../identifier-objects/Siret";
import Siren from "../../../../identifier-objects/Siren";
import { ApplicationStatus } from "dto";
import SaveHeliosEntitiesToFlatUseCase from "./save-helios-entities-to-flat.use-case";
import { ApplicationFlatService } from "../../../application-flat/application-flat.service";
import { PaymentFlatService } from "../../../payment-flat/payment-flat.service";
import SaveHeliosDataUseCase from "./save-helios-data.use-case";
import HeliosPort from "../../../../adapters/outputs/db/providers/helios/helios.port";
import { ApplicationFlatEntity } from "../../../../entities/flats/ApplicationFlatEntity";
import PaymentFlatEntity from "../../../../entities/flats/PaymentFlatEntity";
import { ReadableStream } from "node:stream/web";

jest.mock("node:stream/web");

describe("Helios Use Cases", () => {
    const mockSirenePort = mock<SireneStockUniteLegalePort>();
    mockSirenePort.findOneBySiren.mockResolvedValue(STOCK_UNITE_LEGALE_ENTITY);
    const ENTITIES = [HELIOS_ENTITY];
    const DTOS = [HELIOS_DTO];

    afterEach(() => {
        mockSirenePort.findOneBySiren.mockReset();
    });

    describe("ExtractHeliosBeneficiaryInfos", () => {
        it("returns beneficiary identifiers informations", () => {
            const useCase = new ExtractHeliosBeneficaryInfosUseCase(mockSirenePort);
            expect(useCase.execute(HELIOS_ENTITY)).toMatchSnapshot();
        });
    });

    describe("ExtractHeliosApplicationFlatSpecificFields", () => {
        it("returns specific application flat fields", () => {
            const useCase = new ExtractHeliosApplicationFlatSpecificFields();
            expect(useCase.execute(HELIOS_ENTITY)).toMatchSnapshot();
        });
    });

    describe("ExtractHeliosPaymentFlatSpecificFields", () => {
        it("returns specific payment flat fields", () => {
            const useCase = new ExtractHeliosPaymentFlatSpecificFieldsUseCase();
            expect(useCase.execute(HELIOS_ENTITY)).toMatchSnapshot();
        });
    });

    describe("TransformHeliosDtoToEntity", () => {
        it("transforms dto to entity", () => {
            const useCase = new TransformHeliosDtoToEntityUseCase();
            expect(useCase.execute(HELIOS_DTO)).toMatchSnapshot({ updateDate: expect.any(Date) });
        });
    });

    describe("TransformHeliosEntitiesToFlat", () => {
        const mockExtractBeneficaryInfos = {
            execute: jest.fn().mockResolvedValue({
                beneficiaryEstablishmentId: new Siret(DEFAULT_ASSOCIATION.siret),
                beneficiaryEstablishmentIdType: "siret",
                beneficiaryCompanyId: new Siren(DEFAULT_ASSOCIATION.siren),
                beneficiaryCompanyIdType: "siren",
            }),
        } as unknown as ExtractHeliosBeneficaryInfosUseCase;

        const mockExtractApplicationSpecificsFields = {
            execute: jest.fn().mockReturnValue({
                allocatorName: HELIOS_ENTITY.collec,
                allocatorIdType: Siret.getName(),
                applicationId: "helios-APPLICATION_ID",
                applicationProviderId: "APPLICATON_ID",
                statusLabel: ApplicationStatus.GRANTED,
                requestedAmount: null,
                grantedAmount: HELIOS_ENTITY.montantPaiment,
            }),
        } as unknown as ExtractHeliosApplicationFlatSpecificFields;

        const mockExtractPaymentSpecificsFields = {
            execute: jest.fn().mockReturnValue({
                paymentId: HELIOS_ENTITY.id,
                amount: HELIOS_ENTITY.montantPaiment,
                operationDate: HELIOS_ENTITY.datePaiement,
            }),
        } as unknown as ExtractHeliosPaymentFlatSpecificFieldsUseCase;

        const useCase = new TransformHeliosEntitiesToFlat(
            mockExtractBeneficaryInfos,
            mockExtractPaymentSpecificsFields,
            mockExtractApplicationSpecificsFields,
        );

        it("extract beneficiary info for each dto", async () => {
            await useCase.execute(ENTITIES);
            expect(mockExtractBeneficaryInfos.execute).toHaveBeenCalledWith(ENTITIES[0]);
        });

        it("extract payment flat specific fields", async () => {
            await useCase.execute(ENTITIES);
            expect(mockExtractPaymentSpecificsFields.execute).toHaveBeenCalledWith(ENTITIES[0]);
        });

        it("extract application flat specific fields", async () => {
            await useCase.execute(ENTITIES);
            expect(mockExtractApplicationSpecificsFields.execute).toHaveBeenCalledWith(ENTITIES[0]);
        });

        it("returns array of application and payment flat", async () => {
            expect(async () => await useCase.execute(ENTITIES)).toMatchSnapshot();
        });
    });

    describe("SaveHeliosEntitiesToFlat", () => {
        const PAYMENTS = ["payments"];
        const APPLICATIONS = ["applications"];
        const mockApplicationService = { saveFromStream: jest.fn() } as unknown as ApplicationFlatService;
        const mockPaymentService = { saveFromStream: jest.fn() } as unknown as PaymentFlatService;
        const mockTransformEntitiesToFlat = {
            execute: jest.fn().mockResolvedValue({
                applications: APPLICATIONS as unknown as ApplicationFlatEntity,
                payments: PAYMENTS as unknown as PaymentFlatEntity,
            }),
        } as unknown as TransformHeliosEntitiesToFlat;

        const useCase = new SaveHeliosEntitiesToFlatUseCase(
            mockTransformEntitiesToFlat,
            mockApplicationService,
            mockPaymentService,
        );

        // @ts-expect-error: mock stream build
        const mockReadableStreamFrom = jest.spyOn(ReadableStream, "from").mockReturnValue([{}]);

        beforeEach(() => {
            mockReadableStreamFrom.mockClear();
        });

        it("transforms entities to flat", async () => {
            await useCase.execute(ENTITIES);
            expect(mockTransformEntitiesToFlat.execute).toHaveBeenCalledWith(ENTITIES);
        });

        it("should transform entities to stream", async () => {
            await useCase.execute(ENTITIES);
            expect(ReadableStream.from).toHaveBeenNthCalledWith(1, PAYMENTS);
            expect(ReadableStream.from).toHaveBeenNthCalledWith(2, APPLICATIONS);
        });

        it("saves applications flat from stream", async () => {
            // @ts-expect-error: mock stream
            mockReadableStreamFrom.mockReturnValueOnce(PAYMENTS);
            // @ts-expect-error: mock stream
            mockReadableStreamFrom.mockReturnValueOnce(APPLICATIONS);
            await useCase.execute(ENTITIES);
            expect(mockApplicationService.saveFromStream).toHaveBeenCalledWith(APPLICATIONS);
        });

        it("saves payments flat from stream", async () => {
            // @ts-expect-error: mock stream
            mockReadableStreamFrom.mockReturnValueOnce(PAYMENTS);
            await useCase.execute(ENTITIES);
            expect(mockPaymentService.saveFromStream).toHaveBeenCalledWith(PAYMENTS);
        });
    });

    describe("SaveHeliosData", () => {
        const mockTransformDtoToEntity = {
            execute: jest.fn().mockReturnValue(HELIOS_ENTITY),
        } as unknown as TransformHeliosDtoToEntityUseCase;
        const mockSaveToFlat = {
            execute: jest.fn(),
        } as unknown as SaveHeliosEntitiesToFlatUseCase;
        const mockHeliosPort = mock<HeliosPort>();

        const useCase = new SaveHeliosDataUseCase(mockTransformDtoToEntity, mockSaveToFlat, mockHeliosPort);

        it("transforms dtos to entities", async () => {
            await useCase.execute(DTOS);
            expect(mockTransformDtoToEntity.execute).toHaveBeenCalledWith(DTOS[0]);
        });

        it("persists entities", async () => {
            await useCase.execute(DTOS);
            expect(mockHeliosPort.insertMany).toHaveBeenCalledWith(ENTITIES);
        });

        it("saves entities to flats", async () => {
            await useCase.execute(DTOS);
            expect(mockSaveToFlat.execute).toHaveBeenCalledWith(ENTITIES);
        });
    });
});
