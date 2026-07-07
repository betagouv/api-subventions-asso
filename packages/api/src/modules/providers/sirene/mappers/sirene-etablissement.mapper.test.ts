import {
    SIRENE_ETABLISSEMENT_DBO,
    SIRENE_ETABLISSEMENT_DTO,
    SIRENE_ETABLISSEMENT_ENTITY,
} from "../__fixtures__/sirene-etablissement.fixture";
import SireneEtablissementMapper from "./sirene-etablissement.mapper";

describe("SireneEtablissementMapper", () => {
    describe("dtoToEntity", () => {
        it("returns entity with identifier objects", () => {
            expect(SireneEtablissementMapper.dtoToEntity(SIRENE_ETABLISSEMENT_DTO)).toEqual(
                SIRENE_ETABLISSEMENT_ENTITY,
            );
        });
    });

    describe("entityToDbo", () => {
        it("keeps selected columns", () => {
            expect(Object.keys(SireneEtablissementMapper.entityToDbo(SIRENE_ETABLISSEMENT_ENTITY)).sort()).toEqual([
                "codeCommuneEtablissement",
                "codePaysEtrangerEtablissement",
                "codePostalEtablissement",
                "etablissementSiege",
                "libelleCommuneEtablissement",
                "libellePaysEtrangerEtablissement",
                "libelleVoieEtablissement",
                "nic",
                "numeroVoieEtablissement",
                "siren",
                "siret",
                "typeVoieEtablissement",
            ]);
        });

        it("returns dbo with string identifiers", () => {
            expect(SireneEtablissementMapper.entityToDbo(SIRENE_ETABLISSEMENT_ENTITY)).toEqual(
                expect.objectContaining({
                    siren: SIRENE_ETABLISSEMENT_DTO.siren,
                    siret: SIRENE_ETABLISSEMENT_DTO.siret,
                }),
            );
        });
    });

    describe("dboToEntity", () => {
        it("returns entity from dbo", () => {
            const { _id, ...dbo } = SIRENE_ETABLISSEMENT_DBO;
            expect(SireneEtablissementMapper.dboToEntity(dbo)).toEqual(SIRENE_ETABLISSEMENT_ENTITY);
        });
    });
});
