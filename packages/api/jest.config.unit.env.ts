import {
    JEST_DATA_BRETAGNE_PASSWORD,
    JEST_DATA_BRETAGNE_USERNAME,
    JEST_FRONT_OFFICE_URL,
    JEST_SCDL_FILE_PROCESSING_PATH,
} from "./jest.config.env";

process.env.MAIL_USER = "test@datasubvention.fr";
process.env.JWT_SECRET = "FAKE_JWT_SECRET";
process.env.API_BREVO_CONTACT_LIST = "1";
process.env.API_BREVO_TOKEN = "FAKE_TOKEN";
process.env.DEMARCHES_SIMPLIFIEES_TOKEN = "FAKE_TOKEN";
process.env.ENV = "test";
process.env.DATA_BRETAGNE_USERNAME = JEST_DATA_BRETAGNE_USERNAME;
process.env.DATA_BRETAGNE_PASSWORD = JEST_DATA_BRETAGNE_PASSWORD;
process.env.AGENT_CONNECT_ENABLED = "true";
process.env.FRONT_OFFICE_URL = JEST_FRONT_OFFICE_URL;
process.env.SCDL_FILE_PROCESSING_PATH = JEST_SCDL_FILE_PROCESSING_PATH;

jest.mock("axios");

// Added to not get error with node v18.20
Object.defineProperty(global, "performance", {
    writable: true,
});
