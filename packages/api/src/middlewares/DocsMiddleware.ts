import * as swaggerUi from "swagger-ui-express";

export const docsMiddlewares = async () => [
    (_req, res, next) => {
        res.setHeader(
            "Content-Security-Policy",
            "default-src 'none'; img-src 'self' data:; script-src 'unsafe-eval' 'self'; style-src 'self' 'unsafe-inline' ; connect-src 'self'",
        );
        next();
    },
    swaggerUi.serve,

    swaggerUi.setup(await import("../../tsoa/swagger.json"), {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Data Subvention",
        customfavIcon: "/assets/images/favicons/favicon.ico",
    }),
];
