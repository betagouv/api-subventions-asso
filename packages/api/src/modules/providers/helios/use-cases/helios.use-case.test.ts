import { mock } from "jest-mock-extended";
import ExtractHeliosApplicationFlatSpecificFields from "./extract-helios-application-flat-specific-fields.use-case";
import ExtractHeliosBeneficaryInfosUseCase from "./extract-helios-beneficary-info.use-case";
import ExtractHeliosPaymentFlatSpecificFieldsUseCase from "./extract-helios-payment-flat-specific-fields.use-case";
import TransformHeliosDtoToEntityUseCase from "./transform-helios-dto-to-entity.use-case";
import { HELIOS_ENTITY } from "../__fixtures__/helios.fixture";
import { HELIOS_DTO } from "../../../../adapters/outputs/db/providers/helios/__fixtures__/helios.fixture";
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
import FindSiretFromAssociationIdentifierUseCase from "../../../associations/use-cases/find-siret-from-association-identifier.use-case";

jest.mock("node:stream/web");

describe("Helios Use Cases", () => {
    const ENTITIES = [HELIOS_ENTITY];
    const DTOS = [HELIOS_DTO];

    const mockFindSiretFromAssoIdentifier = {
        execute: jest.fn().mockResolvedValue(new Siret(DEFAULT_ASSOCIATION.siret)),
    } as unknown as FindSiretFromAssociationIdentifierUseCase;

    describe("ExtractHeliosBeneficiaryInfos", () => {
        it("returns beneficiary identifiers informations", () => {
            const useCase = new ExtractHeliosBeneficaryInfosUseCase(mockFindSiretFromAssoIdentifier);
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
        const IDENTIFIER = new Siren(DEFAULT_ASSOCIATION.siren);
        const mockTransformDtoToEntity = {
            execute: jest.fn().mockReturnValue(HELIOS_ENTITY),
        };
        const mockGetIdentifier = { execute: jest.fn().mockReturnValue(IDENTIFIER) };
        const mockCheckIsFromAsso = { execute: jest.fn().mockResolvedValue(true) };
        const mockSaveToFlat = {
            execute: jest.fn(),
        };
        const mockHeliosPort = mock<HeliosPort>();

        const useCase = new SaveHeliosDataUseCase(
            mockTransformDtoToEntity,
            mockGetIdentifier,
            // @ts-expect-error: inject mock
            mockCheckIsFromAsso,
            mockSaveToFlat,
            mockHeliosPort,
        );

        it("transforms dtos to entities", async () => {
            await useCase.execute(DTOS);
            expect(mockTransformDtoToEntity.execute).toHaveBeenCalledWith(DTOS[0]);
        });

        it("get identifier object to perform asso filtering", async () => {
            const ENTITIES = [HELIOS_ENTITY, { ...HELIOS_ENTITY, immatriculation: "20000000000018" }];
            mockTransformDtoToEntity.execute.mockReturnValueOnce(ENTITIES[0]);
            mockTransformDtoToEntity.execute.mockReturnValueOnce(ENTITIES[1]);
            await useCase.execute([HELIOS_DTO, HELIOS_DTO]);

            ENTITIES.forEach((entity, index) => {
                expect(mockGetIdentifier.execute).toHaveBeenNthCalledWith(index + 1, entity.immatriculation);
            });
        });

        it("check if identifier belongs to an association ", async () => {
            const ENTITIES = [HELIOS_ENTITY, { ...HELIOS_ENTITY, immatriculation: "20000000000018" }];
            mockTransformDtoToEntity.execute.mockReturnValueOnce(ENTITIES[0]);
            mockTransformDtoToEntity.execute.mockReturnValueOnce(ENTITIES[1]);
            await useCase.execute([HELIOS_DTO, HELIOS_DTO]);

            ENTITIES.forEach((_entity, index) => {
                expect(mockCheckIsFromAsso.execute).toHaveBeenNthCalledWith(index + 1, IDENTIFIER);
            });
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
