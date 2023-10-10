import DemarchesSimplifieesDto from "../dto/DemarchesSimplifieesDto";
import DemarchesSimplifieesDtoAdapter from "./DemarchesSimplifieesDtoAdapter";

describe("DemarchesSimplifieesDtoAdapter", () => {
    describe("toEntities", () => {
        const SIRET = "00000000000000";
        it("should return valid entity", () => {
            const actual = DemarchesSimplifieesDtoAdapter.toEntities(
                {
                    data: {
                        demarche: {
                            dossiers: {
                                nodes: [
                                    {
                                        demandeur: {
                                            siret: SIRET,
                                        },
                                        champs: [
                                            {
                                                id: "ID",
                                                stringValue: "YO",
                                                label: "PLAI",
                                            },
                                        ],
                                        annotations: [
                                            {
                                                id: "ID",
                                                stringValue: "YO",
                                                label: "PLAI",
                                            },
                                        ],
                                    },
                                ],
                                pageInfo: {
                                    hasPreviousPage: false,
                                    hasNextPage: false,
                                    endCursor: "MTM",
                                },
                            },
                            service: {
                                nom: "Service jeunesse et prévention, Direction des affaires maritimes ",
                                organisme: "mairie de Mours, préfecture de l'Oise, ministère de la Culture",
                            },
                        },
                    },
                } as unknown as DemarchesSimplifieesDto,
                12345,
            );

            expect(actual).toMatchSnapshot();
        });
    });
});
