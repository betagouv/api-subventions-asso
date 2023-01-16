import * as swaggerUi from "swagger-ui-express";

export const docsMiddlewares = async () => [
    swaggerUi.serve,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    swaggerUi.setup(await import("../../tsoa/swagger.json"), {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Data Subvention",
        customfavIcon: "/assets/images/favicons/favicon.ico"
    })
];
