import { Rna, Siren } from "../../../../identifier-objects";
import StructureDto, { StructureDocumentDto } from "../../../../modules/providers/api-asso/dto/StructureDto";
import { RnaStructureDto } from "../../../../modules/providers/api-asso/dto/RnaStructureDto";
import { SirenStructureDto } from "../../../../modules/providers/api-asso/dto/SirenStructureDto";

export default interface ApiAssoPort {
    getStructure(identifier: Rna | Siren): Promise<StructureDto>;
    getRnaStructure(rna: Rna): Promise<RnaStructureDto>;
    getSirenStructure(siren: Siren): Promise<SirenStructureDto>;
    getDocuments(identifier: Siren | Rna): Promise<StructureDocumentDto>;
}
