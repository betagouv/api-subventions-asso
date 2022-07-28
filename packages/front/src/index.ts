import "dotenv/config"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

import express from "express";
import path from "path";
import bodyParser from "body-parser";
import authMiddleware from "./middlewares/auth.middleware";
import { expressLogger } from "./middlewares/LogMiddleware";
import sessionMiddleware from "./middlewares/session.middleware";
import { version as designSystemVersion } from "../package-lock.json";

import controllers from "./modules/controllers";
import { DefaultObject } from "./@types/utils";
import ControllerMethod, { ControllerRouteDEF } from "./@types/ControllerMethod";
import EJSHelper from "./shared/helpers/EJSHelper";
import * as Components from "./modules/global_components/index";
import User from "./@types/User";

declare module "express-session" {
    interface Session {
        user: User;
        roles?: string[];
    }
}

const appName = `Data.subvention`;
const appVersion = designSystemVersion;
const appDescription = "Les dernières informations sur les associations et leurs subventions";
const appRepo = "https://github.com/betagouv/api-subventions-asso";
const contactEmail = "contact@datasubvention.beta.gouv.fr";
const port = process.env.PORT || 1235;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/static", express.static(path.join(__dirname, "../static")));
// Hack for importing css from npm package
app.use("/~", express.static(path.join(__dirname, "../node_modules")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressLogger());
app.use(sessionMiddleware());
app.use(authMiddleware);

// Populate some variables for all views
app.use(function (req, res, next) {
    res.locals.appName = appName;
    res.locals.appVersion = appVersion;
    res.locals.appDescription = appDescription;
    res.locals.appRepo = appRepo;
    res.locals.contactEmail = contactEmail;
    res.locals.page = req.url;

    res.locals.helper = EJSHelper;
    res.locals.components = Components;
    res.locals.currentSession = req.session;
    next();
});
controllers.forEach(controllerClass => {
    const controller = new controllerClass() as unknown as DefaultObject<ControllerMethod>;
    const basePath = (controller as unknown as DefaultObject<string>).basePath;

    (controller.__methods__ as unknown as ControllerRouteDEF[]).forEach((method: ControllerRouteDEF) => {
        const describe = method;
        const route = `${basePath}/${describe.route}`.replace("//", "/");

        console.log(`${describe.method} => ${route}`);

        switch (describe.method) {
            case "POST":
                app.post(route, describe.function.bind(controller));
                break;
            case "PUT":
                app.put(route, describe.function.bind(controller));
                break;
            case "DELETE":
                app.delete(route, describe.function.bind(controller));
                break;
            case "GET":
            default:
                app.get(route, describe.function.bind(controller));
                break;
        }
    });
});

// app.get('/', (req, res) => {
//   res.render('landing')
// })

// app.get('/login', (req, res) => {
//   res.render('login', {
//     pageTitle: 'Connexion'
//   })
// })

// app.get('/ressources', (req, res) => {
//   res.render('ressources', {
//     pageTitle: 'Ressources'
//   })
// })

// app.get('/formulaire', (req, res) => {
//   res.render('form', {
//     pageTitle: 'Formulaire'
//   })
// })

// app.get('/contact', (req, res) => {
//   res.render('contact', {
//     pageTitle: 'Contact'
//   })
// })

// app.get('/accessibilite', (req, res) => {
//   res.render('accessibilite', {
//     pageTitle: 'Accessibilité'
//   })
// })

// app.get('/components', (req, res) => {
//   res.render('components', {
//     pageTitle: 'Composants'
//   })
// })

// app.get('/colors', (req, res) => {
//   res.render('colors', {
//     pageTitle: 'Couleurs'
//   })
// })

// app.get('/typography', (req, res) => {
//   res.render('typography', {
//     pageTitle: 'Typographie'
//   })
// })

// app.get('/mentions-legales', (req, res) => {
//   res.render('legalNotice', {
//     pageTitle: "Mentions légales",
//     contactEmail: 'mon-produit@beta.gouv.fr',
//   })
// })

module.exports = app.listen(port, () => {
    console.log(`${appName} listening at http://localhost:${port}`);
});
