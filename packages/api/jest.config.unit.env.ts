import {
    JEST_DATA_BRETAGNE_PASSWORD,
    JEST_DATA_BRETAGNE_USERNAME,
    JEST_FRONT_OFFICE_URL,
    JEST_SCDL_FILE_PROCESSING_PATH,
    OMOGEN_URL,
    OMOGEN_API_KEY,
    OMOGEN_AUTH_URL,
    OMOGEN_CLIENT,
    OMOGEN_SECRET,
} from "./jest.config.env";

process.env.MAIL_USER = "test@datasubvention.fr";
process.env.JWT_SECRET = "FAKE_JWT_SECRET";
process.env.API_BREVO_CONTACT_LIST = "1";
process.env.API_BREVO_TOKEN = "FAKE_TOKEN";
process.env.DEMARCHES_SIMPLIFIEES_TOKEN = "FAKE_TOKEN";
process.env.ENV = "test";
process.env.DATA_BRETAGNE_USERNAME = JEST_DATA_BRETAGNE_USERNAME;
process.env.DATA_BRETAGNE_PASSWORD = JEST_DATA_BRETAGNE_PASSWORD;
process.env.FRONT_OFFICE_URL = JEST_FRONT_OFFICE_URL;
process.env.SCDL_FILE_PROCESSING_PATH = JEST_SCDL_FILE_PROCESSING_PATH;
process.env.OMOGEN_URL = OMOGEN_URL;
process.env.OMOGEN_AUTH_URL = OMOGEN_AUTH_URL;
process.env.OMOGEN_CLIENT = OMOGEN_CLIENT;
process.env.OMOGEN_SECRET = OMOGEN_SECRET;
process.env.OMOGEN_API_KEY = OMOGEN_API_KEY;

jest.mock("axios");

// Added to not get error with node v18.20
Object.defineProperty(global, "performance", {
    writable: true,
});
