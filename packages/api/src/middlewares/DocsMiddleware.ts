import * as swaggerUi from "swagger-ui-express";
import TSOASwagger from "../../tsoa/swagger.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const docsMiddlewares: any = async () => [
    (_req, res, next) => {
        res.setHeader(
            "Content-Security-Policy",
            "default-src 'none'; img-src 'self' data:; script-src 'unsafe-eval' 'self'; style-src 'self' 'unsafe-inline' ; connect-src 'self'",
        );
        next();
    },
    swaggerUi.serve,

    swaggerUi.setup(TSOASwagger, {
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Data Subvention",
        customfavIcon: "/assets/images/favicons/favicon.ico",
    }),
];
