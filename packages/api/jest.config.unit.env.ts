process.env.MAIL_USER = "test@datasubvention.fr";
process.env.JWT_SECRET = "FAKE_JWT_SECRET";
process.env.API_SENDINBLUE_CONTACT_LIST = "1";
process.env.API_SENDINBLUE_TOKEN = "FAKE_TOKEN";
process.env.DEMARCHES_SIMPLIFIEES_TOKEN = "FAKE_TOKEN";
process.env.ENV = "test";


jest.mock("axios");
